import express from 'express';
import ticketController from '../../../controllers/ticketsController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';
import { cardPay, rwMobileMoney } from '../../../middlewares/flutterwave/flutterwaveMiddleware';
import { ValidationMiddleWare, checkPayments } from '../../../middlewares';

const { newTicketValidation } = ValidationMiddleWare;
const { checkPyament, findTickets } = checkPayments;
const router = express.Router();

router.post('/newTicket/ussd/:eventId', newTicketValidation, ticketController.saveTicketUssd);
router.post('/newTicket/:eventId', isAuthenticated, allowedRoles([1, 2, 3, 4, 5]), newTicketValidation, ticketController.saveTicket);
router.post('/newTicket/validate/:eventId', isAuthenticated, allowedRoles([1, 2, 3, 4, 5]), newTicketValidation, findTickets, ticketController.returnValidated);
router.get('/byEvent/:eventId', isAuthenticated, allowedRoles([2, 3]), ticketController.getTicketByEvent);
router.get('/byEventAndUser/:eventId', isAuthenticated, allowedRoles([2, 3, 4, 5]), ticketController.getTicketByEventAndUser);
router.get('/byUser', isAuthenticated, allowedRoles([4, 5]), ticketController.getTicketByUser);
router.post('/newTicket/payment/cardpay/:eventId', isAuthenticated, allowedRoles([1, 2, 3, 4, 5]), newTicketValidation, cardPay);
router.post('/newTicket/payment/momopay/:eventId', isAuthenticated, allowedRoles([1, 2, 3, 4, 5]), newTicketValidation, findTickets, rwMobileMoney);
router.get('/newTicket/payment/webhook', ticketController.paymentVerificationWebhook);
router.get('/newTicket/failed/payment/webhook', ticketController.paymentVerificationWebhook);
// router.put('/checkup/payment/:eventId', checkPyament, ticketController.entrance);
router.put('/validate/entrance/:eventId', ticketController.entrance);

export default router;
