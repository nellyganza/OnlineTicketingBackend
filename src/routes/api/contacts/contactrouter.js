import express from 'express';
import contactsController from '../../../controllers/contactsController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/', isAuthenticated, allowedRoles([1]), contactsController.allcontact);
router.post('/save', isAuthenticated, allowedRoles([4, 5]), contactsController.savecontact);
router.get('/findById/:id', isAuthenticated, allowedRoles([1, 4, 5]), contactsController.findcontact);
router.get('/findByName/:name', isAuthenticated, allowedRoles([1, 4, 5]), contactsController.findcontactByUserId);
router.put('/update/:id', isAuthenticated, allowedRoles([4, 5]), contactsController.updatecontact);
router.delete('/delete/:id', isAuthenticated, allowedRoles([1]), contactsController.deletecontact);
export default router;
