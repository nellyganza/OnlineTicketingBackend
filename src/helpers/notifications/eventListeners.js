/* eslint-disable camelcase */
import fs from 'fs';
import moment from 'moment';
import eventPaymentService from '../../services/eventPaymentService';
import eventService from '../../services/eventService';
import ticketService from '../../services/ticketService';
import transactionService from '../../services/transactionService';
import userService from '../../services/userService';
import { eventEmitter } from './eventEmitter';

import ticketController from '../../controllers/ticketsController';
import notificationService from '../../services/notifications';
import { logger } from '../Logger';
import htmlToPdf from '../htmlToPdf';
import { sendNotification as sendNewEmailNotification, transporter } from '../mailHelper';
import { successCreationPatTemplate } from '../templates/eventCreatedPattern';
import { sentTicket } from '../templates/sendTicketEmail';
import { successCreationTemplate } from '../templates/succeCreatedEventEmail';
import { renderEmail, sendNotification } from './emailNotifier';

const QRCode = require('qrcode');

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

eventEmitter.on('completeEvent', async () => {
  const total = await eventService.getAllByStatus(0, 1, ['Pending', 'Done']);
  if (total.totalItems > 0) {
    const events = await eventService.getAllByStatus(0, total.totalItems, ['Pending', 'Done']);
    events.data.forEach(async (evt) => {
      const endtime = moment(evt.dateAndTimme).add(evt.duration, 'hours');
      const today =moment();
      if (today.isAfter(endtime) && evt.status === 'Pending') {
        evt.status = 'Done';
        await evt.save();
      }
      if (today.diff(endtime, 'months', true) >= 6) {
        evt.status = 'Complete Done';
        await evt.save();
      }
    });
  }
});

eventEmitter.on('createdEvent', async ({ user, event, paymentMethod }) => {
  try {
    const patt = `You have distributed shares for different Partners 
    <div>
     ${Object.values(paymentMethod).map((p, index) => `<br/><span>${index + 1}. ${p.name} who have ${p.value} %</span><br/>`)}
    </div>`;

    const emailTemplate = successCreationTemplate({
      name: `${user.firstName} ${user.lastName}`, title: event.title, location: event.place, date: event.dateAndTimme, paterns: patt,
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Event Creation',
      html: emailTemplate,
    };
    await transporter.sendMail(mailOptions);
    Object.values(paymentMethod).forEach(async (p, index) => {
      const emailPatTemplate = successCreationPatTemplate({
        name: p.name, title: event.title, location: event.place, date: event.dateAndTimme, share: p.value, id: p.id, eventId: event.id,
      });
      const mailOptions2 = {
        from: process.env.EMAIL,
        to: p.email,
        subject: 'Event Creation',
        html: emailPatTemplate,
      };
      await transporter.sendMail(mailOptions2);
    });
  } catch (error) {
    logger.error(`Error on Sent email${error.message}`);
  }
});

const saveFileToDisk = async (data, fileName) => {
  fs.writeFile(fileName, data, 'base64', (err) => {
    if (err) {
      console.log(err);
    }
  });
};

eventEmitter.on('SendSucessfullPaymentNotification', async (user, eventData, ...list) => {
  try {
    const tickets = await ticketService.findByUserANDEvent({ userId: user, eventId: eventData });
    tickets.forEach(async (ticket) => {
      const {
        fullName, nationalId, phoneNumber, email, sittingPlace, eventId, userId, type,
      } = ticket.dataValues;
      const buyer = await userService.findById(userId);
      const eventPay = await eventPaymentService.findOneById(type);
      const event = await eventService.findById(eventId);
      const { title, place, dateAndTimme } = event.dataValues;
      const segs = [
        { data: nationalId, mode: 'alphanumeric' },
      ];

      const res = await QRCode.toDataURL(segs);
      const data = res.replace(/^data:image\/\w+;base64,/, '');
      const fileName = `${__dirname}/${fullName.replace(/\s/g, '')}barcode.png`;
      await saveFileToDisk(data, fileName);
      const buyerMessage = `Buying Tickets for ${fullName} with NationalID/Passport ${nationalId} goes ok!! <br>   Thank you!!`;
      const sellerMessage = `Client ${buyer.firstName}  ${buyer.lastName} bought ticket for ${fullName} in event ${event.title}`;

      const ticketInfo = {
        email,
        emailData: {
          eventName: title,
          price: eventPay.price,
          date: moment(dateAndTimme, 'dd-MM-yyyy'),
          time: moment(dateAndTimme, 'hh:mm:ss a'),
          place,
          userName: fullName,
          seat: sittingPlace,
          type: eventPay.name,
          fileName: res,
        },
      };
      const pdf = await htmlToPdf(sentTicket(ticketInfo.emailData), `${fullName}ticket.pdf`);
      fs.writeFile(`${fullName}ticket.pdf`, Buffer.from(pdf, 'base64'), { encoding: 'base64' }, (err) => {
        // Finished
      });
      const attach = { fileName: `${fullName}ticket.pdf`, file: `${fullName}ticket.pdf`, cid: 'qrcode' };

      await notificationService.createNotification({
        receiver: email, userId, eventId, message: buyerMessage,
      });

      await notificationService.createNotification({
        receiver: event.dataValues.email, userId: event.dataValues.userId, eventId, message: sellerMessage,
      });

      await sendNotification({
        message: sentTicket(ticketInfo.emailData),
        email,
        attachement: attach,
      });

      const resp = await sendNewEmailNotification({
        to: email,
        subject: 'Ticket from TicketiCore',
        template: 'index',
        attachments: attach,
        data: {
          eventName: title,
          price: eventPay.price,
          date: moment(dateAndTimme, 'dd-MM-yyyy'),
          time: moment(dateAndTimme, 'hh:mm:ss a'),
          place,
          userName: fullName,
          seat: sittingPlace,
          type: eventPay.name,
          fileName: res,
        },
      });
      console.log(resp);

      logger.info(buyerMessage);
      logger.info(sellerMessage);
    });
  } catch (error) {
    logger.error(error.message);
  }
});

eventEmitter.on('SendSucessfullPaymentNotificationUssd', async (ticketId, datas) => {
  try {
    const tickets = await ticketService.findById(ticketId);
    const {
      fullName, nationalId, phoneNumber, email, sittingPlace, eventId, type,
    } = tickets;
    const eventPay = await eventPaymentService.findOneById(type);
    const event = await eventService.findById(eventId);
    const { title, place, dateAndTimme } = event.dataValues;
    const segs = [
      { data: datas.nationalId, mode: 'alphanumeric' },
    ];

    const res = await QRCode.toDataURL(segs);
    const data = res.replace(/^data:image\/\w+;base64,/, '');
    const fileName = `${__dirname}/${fullName}barcode.png`;

    fs.writeFile(fileName, data, { encoding: 'base64' }, (err) => {
      // Finished
    });

    const msg = `<div style="text-align:left;">
    Hello ${fullName}, <br>Here are the details for your ticket. 
    Event Name: ${title} <br>
    Place : ${place} <br>
    Date : ${dateAndTimme} <br>
    Sitting Position : ${sittingPlace} in  ${eventPay.name} <br>
    National ID : ${nationalId} <br>

    Please use attached QR code for entrance when you don't have a National ID card<br>
  
    Thank you for using Intercore Online Ticketing<br><br>
    </div>`;
    const attach = { fileName, file: `${fullName}barcode.png`, cid: 'qrcode' };

    const msms = `Hello ${fullName}, Here are the details for your ticket.
    Event Name: ${title}
    Place : ${place}
    Date : ${dateAndTimme}
    Sitting Position : ${sittingPlace} 
    Holders card : ${nationalId} 
                  
    Thank you for using Intercore Online Ticketing`;

    await sendNotification({
      message: renderEmail(msg),
      email,
      attachement: attach,
    });

    // sendTwilloSms(phoneNumber, msms);
  } catch (error) {
    logger.error(error.message);
  }
});

eventEmitter.on('confirmTicketAfterPayment', async (data) => {
  try {
    const tx_ref = data.data.tx_ref;
    const transaction = await transactionService.findByOneByPropd({ transaction_ref: tx_ref });
    if (transaction) {
      const userId = transaction.dataValues.userId;
      const eventId = transaction.dataValues.eventId;
      const ticketContent = transaction.dataValues.ticketContent;
      const jsonData = JSON.parse(ticketContent);
      const attender = jsonData.attender;
      const pay = jsonData.pay;
      pay.paymenttype = data.data.payment_type;
      await ticketController.createTicket(userId, eventId, attender, pay);
      await transactionService.updateAtt({ status: 'paid' }, { transaction_ref: tx_ref });
    }
  } catch (error) {
    logger.error(error.message);
  }
});
