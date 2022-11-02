import express from 'express';
import rolesPermController from '../../../controllers/rolepermissionController';
import { ValidationMiddleWare } from '../../../middlewares';

const { verifyAdmin } = ValidationMiddleWare;
const router = express.Router();

router.get('/', verifyAdmin, rolesPermController.allRolePermission);
router.post('/save', verifyAdmin, rolesPermController.saveRolePerm);
router.get('/findById/:id', verifyAdmin, rolesPermController.findRolePerm);
router.get('/findByRole/:prop', verifyAdmin, rolesPermController.findRolePermByRole);
router.get('/findByPermission/:prop', verifyAdmin, rolesPermController.findRolePermByPermission);
router.put('/update/:id', verifyAdmin, rolesPermController.updateRolePerm);
router.delete('/delete/:id', verifyAdmin, rolesPermController.deleteRolePerm);

export default router;
