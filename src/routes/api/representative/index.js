import express from 'express';
import representativeController from '../../../controllers/representativeController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
router.get('/', isAuthenticated, allowedRoles(['super_admin','manager', 'event_admin']), representativeController.allRepresentative);
router.post('/save', isAuthenticated, allowedRoles(['super_admin','manager', 'event_admin']), representativeController.saveRepresentative);
router.get('/findById/:id', isAuthenticated, allowedRoles(['super_admin','manager', 'event_admin']), representativeController.findRepresentative);
router.put('/update/:id', isAuthenticated, allowedRoles(['super_admin','manager', 'event_admin']), representativeController.updateRepresentative);
router.delete('/delete/:id', isAuthenticated, allowedRoles(['super_admin','manager', 'event_admin']), representativeController.deleteRepresentative);
export default router;
