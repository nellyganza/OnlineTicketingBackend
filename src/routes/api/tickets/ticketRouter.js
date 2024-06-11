import express from 'express';
import ticketController from '../../../controllers/ticketsController';
import Util from '../../../helpers/utils';
import { ValidationMiddleWare, checkPayments } from '../../../middlewares';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import { cardPay, rwMobileMoney } from '../../../middlewares/flutterwave/flutterwaveMiddleware';
import TicketService from '../../../services/ticketService';

const { newTicketValidation } = ValidationMiddleWare;
const { checkPyament, findTickets } = checkPayments;

const router = express.Router();
const util = new Util();

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
router.put('/validate/entrance/:eventId', isAuthenticated, allowedRoles(['validator_user']), ticketController.entrance);
router.get('/filterByHoster', isAuthenticated, allowedRoles(['manager', 'event_admin']), ticketController.getTicketByHoster);

router.get('/resentemail/:ticketId', isAuthenticated, allowedRoles(['manager', 'event_admin']), async (req, res) => {
  try {
    const { ticketId } = req.params;
    const foundTicket = await TicketService.findById(ticketId);
    if (foundTicket) {
      await ticketController.sendTicketEmail(foundTicket);
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
