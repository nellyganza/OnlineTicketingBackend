import express from 'express';
import eventController from '../../../controllers/eventPaymentController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/:eventId', isAuthenticated, allowedRoles([2, 3]), eventController.createPaymentByEId);
router.get('/:eventId', eventController.getAllPaymentByEId);
router.put('/:id', isAuthenticated, allowedRoles([2, 3]), eventController.updatePaymentPlaceByPId);
router.delete('/:id', isAuthenticated, allowedRoles([2, 3]), eventController.deletePaymentPlaceByPId);
router.get('/find/:id', isAuthenticated, allowedRoles([2, 3]), eventController.findByID);

export default router;
