import express from 'express';
import eventController from '../../../controllers/eventsContoller';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';
import fileController from '../../../controllers/fileController';
import { fileUploader } from '../../../helpers/fileUploader';
import { ValidationMiddleWare } from '../../../middlewares';

const {
  checkDates, newEventEventValidation, eventImages, eventUpdate,
} = ValidationMiddleWare;
const router = express.Router();

router.post('/', isAuthenticated, allowedRoles([2, 3]), newEventEventValidation, checkDates, eventController.saveEvent);
router.get('/', eventController.getAllEvent);
router.get('/findByDates', eventController.findBetween);
router.put('/:eventId', isAuthenticated, allowedRoles([2, 3]), eventUpdate, eventController.updateEvent);
router.delete('/:eventId', isAuthenticated, allowedRoles([2]), eventController.deleteEvent);
router.put('/upload/:eventId', isAuthenticated, allowedRoles([2, 3]), fileUploader.any(), fileController.uploadEvents);
router.get('/numberofTicket/:eventId', isAuthenticated, eventController.getTicketNumber);
export default router;
