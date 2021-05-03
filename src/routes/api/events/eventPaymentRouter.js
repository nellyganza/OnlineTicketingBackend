import express from 'express';
import eventController from '../../../controllers/eventPaymentController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/:eventId', isAuthenticated, allowedRoles([2, 3]), eventController.createPaymentByEId);
router.get('/:eventId', isAuthenticated, allowedRoles([2, 3]), eventController.getAllPaymentByEId);
router.put('/:id', isAuthenticated, allowedRoles([2, 3]), eventController.updatePaymentPlaceByPId);
router.delete('/:id', isAuthenticated, allowedRoles([2, 3]), eventController.deletePaymentPlaceByPId);

export default router;
