import express from 'express';
import CategoryController from '../../../controllers/CategoryController';
import { upload } from '../../../middlewares/mongo/upload';
import { verifyAdmin } from '../../../middlewares/validators/validationMiddleware';

const router = express.Router();
router.post('/create', upload.array('file', 10), CategoryController.saveCategory);
router.get('/findAll', CategoryController.getAllCategory);
router.delete('/delete/:id', verifyAdmin, CategoryController.deleteCategory);
router.put('/update/:id', verifyAdmin, upload.array('file', 10), CategoryController.updateCategory);
router.get('/findAllTree', CategoryController.getAllTreeDataCategory);

export default router;
