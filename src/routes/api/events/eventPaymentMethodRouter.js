import express from 'express';
import { USER_ROLES } from '../../../UIConstants/UserRoles';
import eventController from '../../../controllers/eventPaymentMethodController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/:eventId', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.createPaymentMethodByEId);
router.get('/:eventId', eventController.getAllPaymentMethodByEId);
router.put('/:id', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.updatePaymentPlaceByPId);
router.delete('/:id', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.deletePaymentPlaceByPId);

export default router;
