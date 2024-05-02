import express from 'express';
import { USER_ROLES } from '../../../UIConstants/UserRoles';
import eventController from '../../../controllers/eventPaymentController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.createPaymentByEId);
router.get('/all/:eventId', eventController.getAllPaymentByEId);
router.put('/:id', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.updatePaymentPlaceByPId);
router.delete('/:id', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.deletePaymentPlaceByPId);
router.get('/find/:id', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.findByID);
router.post('/eventvalidator', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.createEventValidator);
router.get('/list/validator', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN, USER_ROLES.EVENT_VALIDATOR]), eventController.getEventValidatorsByProp);
export default router;
