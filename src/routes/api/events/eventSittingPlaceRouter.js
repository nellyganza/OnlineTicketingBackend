import express from 'express';
import { USER_ROLES } from '../../../UIConstants/UserRoles';
import eventController from '../../../controllers/eventSittingPlaceContoller';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/:eventId', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.createSittinPlaces);
router.get('/:eventId', eventController.getAllSittinPlaces);
router.put('/:id', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.updateSittingPlace);
router.delete('/:id', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), eventController.deleteSittingPlace);

export default router;
