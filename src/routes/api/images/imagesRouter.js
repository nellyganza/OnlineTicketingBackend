import express from 'express';
import imagesController from '../../../controllers/slidingImagesController';
import { fileUploader } from '../../../helpers/fileUploader';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import fileController from '../../../controllers/fileController';
import { upload } from '../../../middlewares/mongo/upload';

const router = express.Router();
router.post('/', isAuthenticated, allowedRoles(['super_admin']), upload.array('file', 10), imagesController.registerImage);
router.get('/getAll/:type', imagesController.getImages);
router.delete('/:id', isAuthenticated, allowedRoles(['super_admin']), imagesController.deleteimage);
router.post('/upload', fileUploader.any(), fileController.upload);
export default router;
