import express from 'express';
import eventController from '../../../controllers/eventSittingPlaceContoller';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.createSittinPlaces);
router.get('/:eventId', eventController.getAllSittinPlaces);
router.put('/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.updateSittingPlace);
router.delete('/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), eventController.deleteSittingPlace);

export default router;
