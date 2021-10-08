import express from 'express';
import clientController from '../../../controllers/clientController';
import { fileUploader } from '../../../helpers/fileUploader';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
router.post('/', isAuthenticated, allowedRoles([1]), fileUploader.any(), clientController.registerClient);
router.get('/getAll', clientController.getClients);
router.delete('/:id', isAuthenticated, allowedRoles([1]), clientController.deleteclient);

export default router;
