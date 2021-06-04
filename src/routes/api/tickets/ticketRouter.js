import express from 'express';
import ticketController from '../../../controllers/ticketsController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';
import verfications from '../../../middlewares/verifications/verification';
import { pay } from '../../../middlewares/stripe/stripeMiddleware';
import { cardPay, rwMobileMoney } from '../../../middlewares/flutterwave/flutterwaveMiddleware';
import { ValidationMiddleWare, checkPayments } from '../../../middlewares';

const { newTicketValidation, verfiyCardNumbers } = ValidationMiddleWare;
const { checkPyament } = checkPayments;
const router = express.Router();

// router.post('/newTicket/:eventId', isAuthenticated, allowedRoles([4, 5]), verfications.verfiyCardNumbers, ticketController.saveTicket);
router.get('/byEvent/:eventId', isAuthenticated, allowedRoles([2, 3]), ticketController.getTicketByEvent);
router.get('/byEventAndUser/:eventId', isAuthenticated, allowedRoles([2, 3, 4, 5]), ticketController.getTicketByEventAndUser);
router.get('/byUser', isAuthenticated, allowedRoles([4, 5]), ticketController.getTicketByUser);
router.post('/newTicket/payment/cardpay/:eventId', isAuthenticated, allowedRoles([4, 5]), newTicketValidation, verfiyCardNumbers, pay, ticketController.saveTicket);
router.post('/newTicket/payment/momopay/:eventId', isAuthenticated, allowedRoles([4, 5]), newTicketValidation, verfiyCardNumbers, rwMobileMoney, ticketController.saveTicket);
router.get('/newTicket/payment/webhook', ticketController.paymentVerificationWebhook);
router.get('/newTicket/failed/payment/webhook', ticketController.paymentVerificationWebhook);
router.put('/checkup/payment/:eventId', checkPyament, ticketController.entrance);
export default router;
