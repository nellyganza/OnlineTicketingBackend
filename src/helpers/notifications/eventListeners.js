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

const QRCode = require('qrcode');

const unirest = require('unirest');

const logger = new Logger('intercore.log');

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
            } else {
              console.log('Not Payed');
            }
          }, (error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  });
});

eventEmitter.on('completeEvent', async () => {
  const events = await eventService.getAll();
  const today = moment().format('llll');
  events.forEach(async (evt) => {
    const endtime = moment(evt.dateAndTimme).add(evt.duration, 'hours').format('llll');
    if (endtime === today) {
      evt.status = 'Done';
      await evt.save();
    }
  });
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

    // sendMessageSMS(phoneNumber, msms);

    logger.info(buyerMessage);
    logger.info(sellerMessage);
  } catch (error) {
    console.log(error);
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

    // sendMessageSMS(phoneNumber, msms);
  } catch (error) {
    console.log(error);
    logger.error(error.message);
  }
});
