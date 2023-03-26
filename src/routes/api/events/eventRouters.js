import express from 'express';
import eventController from '../../../controllers/eventsContoller';
import { isAuthenticated, allowedRoles, checkBlocked } from '../../../middlewares/authorization';
import fileController from '../../../controllers/fileController';
import { fileUploader } from '../../../helpers/fileUploader';
import { ValidationMiddleWare } from '../../../middlewares';
import { upload } from '../../../middlewares/mongo/upload';

const {
  checkDates, newEventEventValidation, eventImages, eventUpdate,
} = ValidationMiddleWare;
const router = express.Router();

router.post('/', isAuthenticated, allowedRoles(['manager', 'event_admin']),upload.array('file', 10), checkBlocked, newEventEventValidation, checkDates, fileController.setEventImages, eventController.saveEvent);
router.get('/', eventController.getAllEvent);
router.get('/calender', eventController.getEventCalenderDate);
router.get('/find/:eventId', eventController.getEventById);
router.get('/user', isAuthenticated, allowedRoles(['manager', 'event_admin']), checkBlocked, eventController.getAllEventByUser);
router.get('/findByDates', eventController.findBetween);
router.put('/edit/', isAuthenticated, allowedRoles(['manager', 'event_admin']),upload.array('file', 10), checkBlocked, eventUpdate,fileController.setEventImages, eventController.updateEvent);
router.delete('/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), checkBlocked, eventController.deleteEvent);
router.put('/upload/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), fileUploader.any(), fileController.uploadEvents);
router.get('/numberofTicket/:eventId', eventController.getTicketNumber);
router.get('/byNameCategoryDate', eventController.getFillteredEvents1);
router.get('/filter', eventController.getFillteredEvents);
export default router;
