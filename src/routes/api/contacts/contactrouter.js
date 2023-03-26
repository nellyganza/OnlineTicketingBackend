import express from 'express';
import contactsController from '../../../controllers/contactsController';
import { isAuthenticated, allowedRoles } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/', isAuthenticated, allowedRoles(['super_admin']), contactsController.allcontact);
router.post('/save', contactsController.savecontact);
router.get('/findById/:id', isAuthenticated, allowedRoles(['super_admin', 'buyer_user', 'attender_user']), contactsController.findcontact);
router.get('/findByName/:name', isAuthenticated, allowedRoles(['super_admin', 'buyer_user', 'attender_user']), contactsController.findcontactByUserId);
router.put('/update/:id', isAuthenticated, allowedRoles(['super_admin']), contactsController.updatecontact);
router.put('/read/:id', isAuthenticated, allowedRoles(['super_admin']), contactsController.readcontact);
router.delete('/delete/:id', isAuthenticated, allowedRoles(['super_admin']), contactsController.deletecontact);
export default router;
