import express from 'express';
import guestsController from '../../../controllers/guestController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/:eventId', isAuthenticated, allowedRoles([2, 3]), guestsController.allGuest);
router.post('/save', isAuthenticated, allowedRoles([2, 3]), guestsController.saveGuest);
router.get('/findById/:id', isAuthenticated, allowedRoles([2, 3]), guestsController.findGuest);
router.put('/update/:id', isAuthenticated, allowedRoles([2, 3]), guestsController.updateGuest);
router.delete('/delete/:id', isAuthenticated, allowedRoles([2, 3]), guestsController.deleteGuest);
export default router;
