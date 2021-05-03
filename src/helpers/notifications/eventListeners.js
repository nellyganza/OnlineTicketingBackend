/* eslint-disable camelcase */
import { eventEmitter } from '../notifications/eventEmitter';
import transactionService from '../../services/transactionService';
import ticketService from '../../services/ticketService';
import eventService  from '../../services/eventService';
import userService from '../../services/userService';
import {sendSMS} from '../notifications/smsNotification';
import notificationsController from '../../controllers/notificationsController';

const {notifyTheUser} = notificationsController;
const unirest = require('unirest');
const server_url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/verify';
eventEmitter.on('verifyTransactionEvent', async () => {
    const transactions = await transactionService.getTransactions();
    transactions.forEach(async(tx)=> {
        if(tx.status==="PENDING"){
            try {
                const payload = {
                    SECKEY: process.env.FRUTTER_SECRET_KEY,
                    txref: tx.transaction_ref,
                };
                unirest.post(server_url)
                .headers({ 'Content-Type': 'application/json' })
                .send(payload)
                .end(async(response) => {
                    if (response.body.data.status === 'successful' && response.body.data.chargecode === '00') {
                        console.log(response.body.data)
                        tx.status="PAYED";
                        await tx.save();
                        eventEmitter.emit("SendSucessfullPaymentNotification",tx);
                    } else {
                        console.log("Not Payed")
                    }
                }, (error) => {
                    console.log(error)
                });

            } catch (error) {
                console.log(error);
            }
        }
    });
})

eventEmitter.on("SendSucessfullPaymentNotification",async(tx)=>{
    const tickets = await ticketService.findByUserANDEvent({userId:tx.user,eventId:tx.event});
    tickets.forEach(async tc => {
        const {fullName,cardNumber,phoneNumber,email,sittingPlace,eventId} = tc.dataValues;
        const event = await eventService.findById(eventId);
        const {title,place,dateAndTimme} = event.dataValues;
        console.log(event);
        var msg =`Hello ${fullName}, <br>Here are the details for your ticket. 
        Event Name: ${title} <br>
        Place : ${place} <br>
        Date : ${dateAndTimme} <br>
        Sitting Position : ${sittingPlace} <br>
        Holders card : ${cardNumber} 
        
        Thank you for using Intercore Online Ticketing<br><br>`
        // sendSMS(phoneNumber,msg);
        notifyTheUser({
            receiver: email,
            userId: tx.user,
            eventId: tx.event,
            message: msg,
          }, email);
    });
})