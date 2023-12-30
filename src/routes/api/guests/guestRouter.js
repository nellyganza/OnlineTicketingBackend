import express from 'express';
import guestsController from '../../../controllers/guestController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
// router.get('/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.allGuest);
router.post('/save', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.saveGuest);
router.get('/findById/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.findGuest);
router.put('/update/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.updateGuest);
router.delete('/delete/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.deleteGuest);
router.get('/filterByHoster', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.getGuestsByHoster);
export default router;
