import express from 'express';
import accountController from '../../../controllers/accountController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), accountController.allAccount);
router.post('/save', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), accountController.saveAccount);
router.get('/findById/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), accountController.findAccount);
router.put('/update/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), accountController.updateAccount);
router.delete('/delete/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), accountController.deleteAccount);
export default router;
