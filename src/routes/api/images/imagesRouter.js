import express from 'express';
import imagesController from '../../../controllers/slidingImagesController';
import { fileUploader } from '../../../helpers/fileUploader';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';

const router = express.Router();
router.post('/', isAuthenticated, allowedRoles([1]), fileUploader.any(), imagesController.registerImage);
router.get('/getAll', imagesController.getImages);
router.delete('/:id', isAuthenticated, allowedRoles([1]), imagesController.deleteimage);

export default router;
