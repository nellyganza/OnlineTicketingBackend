import express from 'express';
import { USER_ROLES } from '../../../UIConstants/UserRoles';
import eventController from '../../../controllers/eventsContoller';
import fileController from '../../../controllers/fileController';
import { fileUploader } from '../../../helpers/fileUploader';
import { ValidationMiddleWare } from '../../../middlewares';
import { allowedRoles, checkBlocked, isAuthenticated } from '../../../middlewares/authorization';
import { uploadArrayMiddleware } from '../../../middlewares/mongo/upload';

const {
  checkDates, newEventEventValidation, eventImages, eventUpdate,
} = ValidationMiddleWare;
const router = express.Router();

router.post('/', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), uploadArrayMiddleware, checkBlocked, newEventEventValidation, checkDates, fileController.setEventImages, eventController.saveEvent);
router.get('/', eventController.getAllEvent);
router.get('/calender', eventController.getEventCalenderDate);
router.get('/find/:eventId', eventController.getEventById);
router.get('/findByDates', eventController.findBetween);
router.put('/edit/', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), uploadArrayMiddleware, checkBlocked, eventUpdate, fileController.setEventImages, eventController.updateEvent);
router.delete('/:eventId', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), checkBlocked, eventController.deleteEvent);
router.put('/upload/:eventId', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), fileUploader.any(), fileController.uploadEvents);
router.get('/numberofTicket/:eventId', eventController.getTicketNumber);
router.get('/byNameCategoryDate', eventController.getFillteredEvents1);
router.get('/filter', eventController.getFillteredEvents);

// filter with user who created the event
router.get('/user', isAuthenticated, allowedRoles([USER_ROLES.EVENT_MANAGER, USER_ROLES.EVENT_ADMIN]), checkBlocked, eventController.getAllEventByUser);

export default router;
