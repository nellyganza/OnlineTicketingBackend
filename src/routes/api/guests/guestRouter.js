import express from 'express';
import guestsController from '../../../controllers/guestController';
import ticketController from '../../../controllers/ticketsController';
import Util from '../../../helpers/utils';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import GuestService from '../../../services/guestService';

const util = new Util();
const router = express.Router();
// router.get('/:eventId', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.allGuest);
router.post('/save', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.saveGuest);
router.get('/findById/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.findGuest);
router.put('/update/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.updateGuest);
router.delete('/delete/:id', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.deleteGuest);
router.get('/filterByHoster', isAuthenticated, allowedRoles(['manager', 'event_admin']), guestsController.getGuestsByHoster);
router.get('/resentemail/:guestId', isAuthenticated, allowedRoles(['manager', 'event_admin']), async (req, res) => {
  try {
    const { guestId } = req.params;
    const foundGuest = await GuestService.findById(guestId);
    if (foundGuest) {
      await ticketController.sendGuestBadgeEmail(foundGuest);
      util.setSuccess(200, 'E-mail sent !');
      return util.send(res);
    }

    util.setError(400, 'E-mail not sent !');
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    util.send(res);
  }
});
export default router;
