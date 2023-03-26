import express from 'express';
import rolesController from '../../../controllers/rolesController';
import { ValidationMiddleWare } from '../../../middlewares';

const { verifyAdmin } = ValidationMiddleWare;
const router = express.Router();
router.get('/', verifyAdmin, rolesController.allRole);
router.post('/save', verifyAdmin, rolesController.saveRole);
router.get('/findById/:id', rolesController.findRole);
router.get('/findByName/:name', verifyAdmin, rolesController.findRoleByName);
router.put('/update/:id', verifyAdmin, rolesController.updateRole);
router.delete('/delete/:id', verifyAdmin, rolesController.deleteRole);
export default router;
