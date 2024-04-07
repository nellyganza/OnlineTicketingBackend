import express from 'express';
import bankController from '../../../controllers/bankController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), bankController.allBank);
router.post('/save', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), bankController.saveBank);
router.get('/findById/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), bankController.findBank);
router.put('/update/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), bankController.updateBank);
router.delete('/delete/:id', isAuthenticated, allowedRoles(['super_admin', 'manager', 'event_admin']), bankController.deleteBank);
export default router;
