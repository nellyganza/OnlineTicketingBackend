import express from 'express';
import clientController from '../../../controllers/clientController';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import { upload } from '../../../middlewares/mongo/upload';

const router = express.Router();
router.post('/', isAuthenticated, allowedRoles(['super_admin']), upload.array('file', 10), clientController.registerClient);
router.get('/getAll', clientController.getClients);
router.delete('/:id', isAuthenticated, allowedRoles(['super_admin']), clientController.deleteclient);

export default router;
