/* eslint-disable camelcase */
import fs from 'fs';
import { eventEmitter } from './eventEmitter';
import transactionService from '../../services/transactionService';
import ticketService from '../../services/ticketService';
import eventService from '../../services/eventService';
import eventPaymentService from '../../services/eventPaymentService';
import userService from '../../services/userService';
import { sendSMS } from './smsNotification';
import notificationsController from '../../controllers/notificationsController';
import { sendMessageSMS } from '../../config/nexmo';

const QRCode = require('qrcode');

const { notifyTheUser } = notificationsController;
const unirest = require('unirest');

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

eventEmitter.on('SendSucessfullPaymentNotification', async (ticketId, datas) => {
  const tickets = await ticketService.findById(ticketId);
  const {
    fullName, nationalId, phoneNumber, email, sittingPlace, eventId, userId, type,
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

  notifyTheUser({
    receiver: email,
    userId,
    eventId,
    message: { msg, attach },
  }, email);
  // sendMessageSMS(phoneNumber, msms);
});
