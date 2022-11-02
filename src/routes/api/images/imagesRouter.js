import express from 'express';
import imagesController from '../../../controllers/slidingImagesController';
import { fileUploader } from '../../../helpers/fileUploader';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import fileController from '../../../controllers/fileController';

const router = express.Router();
router.post('/', isAuthenticated, allowedRoles([1]), fileUploader.any(), imagesController.registerImage);
router.get('/getAll/:type', imagesController.getImages);
router.delete('/:id', isAuthenticated, allowedRoles([1]), imagesController.deleteimage);
router.post('/upload', fileUploader.any(), fileController.upload);
export default router;
