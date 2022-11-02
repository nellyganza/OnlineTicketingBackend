import express from 'express';
import { isAuthenticated } from '../../../middlewares/authorization';
import notificationsController from '../../../controllers/notificationsController';

const router = express.Router();
router.get('/', isAuthenticated, notificationsController.showAll);
router.get('/read/:id', isAuthenticated, notificationsController.markRead);
router.delete('/deleteAll', isAuthenticated, notificationsController.deletAll);
router.delete('/deleteOne/:notId', isAuthenticated, notificationsController.deleteOne);

export default router;
