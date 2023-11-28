import express from 'express';
import ticketController from '../../../controllers/ticketsController';
import { ValidationMiddleWare, checkPayments } from '../../../middlewares';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import { cardPay, rwMobileMoney } from '../../../middlewares/flutterwave/flutterwaveMiddleware';

const { newTicketValidation } = ValidationMiddleWare;
const { checkPyament, findTickets } = checkPayments;
const router = express.Router();

router.post('/newTicket/ussd/:eventId', newTicketValidation, ticketController.saveTicketUssd);
router.post('/newTicket/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, ticketController.saveTicket);
router.post('/newTicket/validate/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, findTickets, ticketController.returnValidated);
router.get('/byEvent/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), ticketController.getTicketByEvent);
router.get('/byEventAndUser/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin', 'buyer_user', 'attender_user']), ticketController.getTicketByEventAndUser);
router.get('/byUser', isAuthenticated, allowedRoles(['buyer_user', 'attender_user']), ticketController.getTicketByUser);
router.post('/newTicket/payment/cardpay/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, cardPay);
router.post('/newTicket/payment/momopay/:eventId', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin', 'buyer_user', 'attender_user']), newTicketValidation, findTickets, rwMobileMoney);
router.get('/newTicket/payment/webhook', ticketController.paymentVerificationWebhook);
router.get('/newTicket/failed/payment/webhook', ticketController.paymentVerificationWebhook);
// router.put('/checkup/payment/:eventId', checkPyament, ticketController.entrance);
router.put('/validate/entrance/:eventId', ticketController.entrance);

router.get('/filterByHoster',isAuthenticated, allowedRoles(['manager', 'event_admin']), ticketController.getTicketByHoster);
export default router;
