import express from 'express';
import eventController from '../../../controllers/eventSittingPlaceContoller';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();

router.post('/:eventId', isAuthenticated, allowedRoles([2, 3]), eventController.createSittinPlaces);
router.get('/:eventId', isAuthenticated, allowedRoles([2, 3]), eventController.getAllSittinPlaces);
router.put('/:id', isAuthenticated, allowedRoles([2, 3]), eventController.updateSittingPlace);
router.delete('/:id', isAuthenticated, allowedRoles([2, 3]), eventController.deleteSittingPlace);

export default router;
