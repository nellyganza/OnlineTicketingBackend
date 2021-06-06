/* eslint-disable camelcase */
import { eventEmitter } from './eventEmitter';
import transactionService from '../../services/transactionService';
import ticketService from '../../services/ticketService';
import eventService from '../../services/eventService';
import userService from '../../services/userService';
import { sendSMS } from './smsNotification';
import notificationsController from '../../controllers/notificationsController';
import { sendMessageSMS } from '../../config/nexmo';

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

eventEmitter.on('SendSucessfullPaymentNotification', async (ticketId) => {
  const tickets = await ticketService.findById(ticketId);
  const {
    fullName, nationalId, phoneNumber, email, sittingPlace, eventId, userId,
  } = tickets;
  const event = await eventService.findById(eventId);
  const { title, place, dateAndTimme } = event.dataValues;
  const msg = `Hello ${fullName}, <br>Here are the details for your ticket. 
        Event Name: ${title} <br>
        Place : ${place} <br>
        Date : ${dateAndTimme} <br>
        Sitting Position : ${sittingPlace} <br>
        Holders card : ${nationalId} 
        
        Thank you for using Intercore Online Ticketing<br><br>`;
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
    message: msg,
  }, email);
  sendMessageSMS(phoneNumber, msms);
});
