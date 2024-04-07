import express from 'express';
import businessInfoController from '../../../controllers/businessInfoController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), businessInfoController.allBusinessInfo);
router.post('/save', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), businessInfoController.saveBusinessInfo);
router.get('/findById/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), businessInfoController.findBusinessInfo);
router.get('/findByUser', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), businessInfoController.findBusinessInfoByUser);
router.put('/update/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), businessInfoController.updateBusinessInfo);
router.delete('/delete/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), businessInfoController.deleteBusinessInfo);
export default router;
