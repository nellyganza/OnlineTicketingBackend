import express from 'express';
import eventController from '../../../controllers/eventPaymentController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.createPaymentByEId);
router.get('/:eventId', eventController.getAllPaymentByEId);
router.put('/', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.updatePaymentPlaceByPId);
router.delete('/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.deletePaymentPlaceByPId);
router.get('/find/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.findByID);

export default router;
