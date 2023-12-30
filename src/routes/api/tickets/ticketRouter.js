import express from 'express';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import ticketController from '../../../controllers/ticketsController';
import htmlToPdf from '../../../helpers/htmlToPdf';
import { sendNotification } from '../../../helpers/mailHelper';
import { sentTicket } from '../../../helpers/templates/sendTicketEmail';
import Util from '../../../helpers/utils';
import { ValidationMiddleWare, checkPayments } from '../../../middlewares';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import { cardPay, rwMobileMoney } from '../../../middlewares/flutterwave/flutterwaveMiddleware';
import TicketService from '../../../services/ticketService';

const { newTicketValidation } = ValidationMiddleWare;
const { checkPyament, findTickets } = checkPayments;
const QRCode = require('qrcode');

const router = express.Router();
const util = new Util();
const saveFileToDisk = async (data, fileName) => fs.writeFileSync(fileName, data, 'base64', (err) => {
  if (err) {
    console.log(err);
  }
});

router.post('/newTicket/ussd/:eventId', newTicketValidation, ticketController.saveTicketUssd);
router.post('/newTicket/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, ticketController.saveTicket);
router.post('/newTicket/validate/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, findTickets, ticketController.returnValidated);
router.get('/byEvent/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), ticketController.getTicketByEvent);
router.get('/byEventAndUser/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin', 'buyer_user', 'attender_user']), ticketController.getTicketByEventAndUser);
router.get('/byUser', isAuthenticated, allowedRoles(['buyer_user', 'attender_user', 'manager', 'event_admin', 'super_admin']), ticketController.getTicketByUser);
router.post('/newTicket/payment/cardpay/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, cardPay);
router.post('/newTicket/payment/momopay/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, findTickets, rwMobileMoney);
router.get('/newTicket/payment/webhook', ticketController.paymentVerificationWebhook);
router.get('/newTicket/failed/payment/webhook', ticketController.paymentVerificationWebhook);
// router.put('/checkup/payment/:eventId', checkPyament, ticketController.entrance);
router.put('/validate/entrance/:eventId', ticketController.entrance);
router.get('/filterByHoster', isAuthenticated, allowedRoles(['manager', 'event_admin']), ticketController.getTicketByHoster);
router.get('/resentemail/:ticketId', isAuthenticated, allowedRoles(['manager', 'event_admin']), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const foundTicket = await TicketService.findById(ticketId);
    if (foundTicket) {
      const {
        User, Event, EventPayment, ...ticket
      } = foundTicket.dataValues;
      const segs = [
        { data: Event.dataValues.nationalId, mode: 'alphanumeric' },
      ];

      const qr = await QRCode.toDataURL(segs);
      const data = qr.replace(/^data:image\/\w+;base64,/, '');
      const generalPath = `${path.resolve()}/src/public/images/`;
      const fileName = `${generalPath + ticket.fullName.replace(/\s/g, '')}barcode.png`;
      await saveFileToDisk(data, fileName);

      const ticketInfo = {
        email: ticket.email,
        emailData: {
          eventName: Event.dataValues.title,
          price: EventPayment.dataValues.price,
          date: moment(Event.dataValues.dateAndTimme).format('LL'),
          time: moment(Event.dataValues.dateAndTimme).format('LT'),
          place: Event.dataValues.place,
          fullName: ticket.fullName,
          userName: `${User.dataValues.firstName} ${User.dataValues.lastName}`,
          seat: ticket.sittingPlace,
          type: EventPayment.dataValues.name,
          cardType: ticket.cardType,
          nationalId: ticket.nationalId,
          fileName: qr,
        },
      };
      const pdfTicketPathFile = `${generalPath + ticket.fullName}ticket.pdf`;
      const pdf = await htmlToPdf(sentTicket(ticketInfo.emailData), pdfTicketPathFile);
      fs.writeFile(pdfTicketPathFile, Buffer.from(pdf, 'base64'), { encoding: 'base64' }, (err) => {
        // Finished
      });
      const attach = { fileName: `${ticket.fullName}ticket.pdf`, path: pdfTicketPathFile, cid: 'ticket' };
      sendNotification({
        to: ticketInfo.email,
        subject: 'Ticket Email from TicketiCore',
        template: 'index',
        attachments: [
          attach, {
            filename: 'favicon.jpg',
            path: `${generalPath}favicon.jpg`,
            cid: 'favicon',
          },
          {
            filename: `${ticket.fullName.replace(/\s/g, '')}barcode.png`,
            path: fileName,
            cid: 'barcode',
          },
        ],
        data: { ...ticketInfo.emailData },
      });
      util.setSuccess(200, 'E-mail sent !');
      return util.send(res);
    }

    util.setError(400, 'E-mail not sent !');
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    util.send(res);
  }
});

export default router;
