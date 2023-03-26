import express from 'express';
import eventController from '../../../controllers/eventPaymentMethodController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.createPaymentMethodByEId);
router.get('/:eventId', eventController.getAllPaymentMethodByEId);
router.put('/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.updatePaymentPlaceByPId);
router.delete('/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.deletePaymentPlaceByPId);

export default router;
