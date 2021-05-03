import express from 'express';
import permissionsController from '../../../controllers/permissionsController';
import { ValidationMiddleWare } from '../../../middlewares';

const { verifyAdmin } = ValidationMiddleWare;
const router = express.Router();
router.get('/', verifyAdmin, permissionsController.allPermission);
router.post('/save', verifyAdmin, permissionsController.savePermission);
router.get('/findByName/:name', verifyAdmin, permissionsController.findPermissionByName);
router.get('/findById/:id', verifyAdmin, permissionsController.findPermission);
router.put('/update/:id', verifyAdmin, permissionsController.updatePermission);
router.delete('/delete/:id', verifyAdmin, permissionsController.deletePermission);
export default router;
