/* eslint-disable camelcase */
import fs from 'fs';
import { Logger } from 'logger';
import moment from 'moment';
import { eventEmitter } from './eventEmitter';
import transactionService from '../../services/transactionService';
import ticketService from '../../services/ticketService';
import eventService from '../../services/eventService';
import eventPaymentService from '../../services/eventPaymentService';
import userService from '../../services/userService';

import notificationService from '../../services/notifications';
import { renderEmail, sendNotification } from './emailNotifier';
import { sendSms, sendTwilloSms } from '../../config/sendSms';
import { transporter } from '../mailHelper';
import { successCreationTemplate } from '../../services/templates/succeCreatedEventEmail';
import { successCreationPatTemplate } from '../../services/templates/eventCreatedPattern';
import Util from '../utils';
import {logger} from '../Logger' 

const QRCode = require('qrcode');

const unirest = require('unirest');

const util = new Util();

const server_url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/verify';
eventEmitter.on('verifyTransactionEvent', async () => {
  const transactions = await transactionService.getTransactions();
  transactions.forEach((tx) => {
    if (tx.status === 'PENDING') {
      try {
        const payload = {
          SECKEY: process.env.FRUTTER_SECRET_KEY,
          txref: tx.transaction_ref,
        };
        unirest.post(server_url)
          .headers({ 'Content-Type': 'application/json' })
          .send(payload)
          .end(async (response) => {
            if (response.body.data.status === 'successful' && response.body.data.chargecode === '00') {
              tx.status = 'PAYED';
              await tx.save();
              eventEmitter.emit('SendSucessfullPaymentNotification', tx);
            }
          }, (error) => {
            console.log(error.message);
          });
      } catch (error) {
        console.log(error.message);
      }
    }
  });
});

eventEmitter.on('completeEvent', async () => {
  const events = await eventService.getAll();
  const today = moment().format('llll');
  const futureDate = moment().subtract(2, 'months').format('llll');
  events.data.forEach(async (evt) => {
    const endtime = moment(evt.dateAndTimme).add(evt.duration, 'hours').format('llll');
    if (moment().isAfter(endtime) && evt.status === 'Pending') {
      evt.status = 'Done';
      await evt.save();
    }
    if (moment().diff(moment(endtime), 'months', true) >= 2) {
      evt.status = 'Complete Done';
      await evt.save();
    }
  });
});

eventEmitter.on('createdEvent', async ({ user, event, paymentMethod }) => {
  try {
    const patt = `You have distributed shares for different Patterns 
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
  Object.values(paymentMethod).map(async (p, index) => {
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
    logger.error(error.message);
  }
});

eventEmitter.on('SendSucessfullPaymentNotification', async (ticketId, datas) => {
  try {
    const tickets = await ticketService.findById(ticketId);
    const {
      fullName, nationalId, phoneNumber, email, sittingPlace, eventId, userId, type,
    } = tickets;
    const buyer = await userService.findById(userId);
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

    const buyerMessage = `Buying Tickets for ${fullName} with NationalID/Passport ${datas.nationalId} goes ok!! <br>   Thank you!!`;
    const sellerMessage = `Client ${buyer.firstName}  ${buyer.lastName} bought ticket for ${fullName} in event ${event.title}`;

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

    await notificationService.createNotification({
      receiver: email, userId, eventId, message: buyerMessage,
    });
    await notificationService.createNotification({
      receiver: event.dataValues.email, userId: event.dataValues.userId, eventId, message: sellerMessage,
    });

    await sendNotification({
      message: renderEmail(msg),
      email,
      attachement: attach,
    });

    sendTwilloSms(phoneNumber, msms);
    sendSms(phoneNumber, msms);

    logger.info(buyerMessage);
    logger.info(sellerMessage);
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
