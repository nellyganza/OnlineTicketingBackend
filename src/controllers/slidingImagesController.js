import Util from '../helpers/utils';
import imagesService from '../services/slidingImageService';
import { cloudinaryUploader } from '../helpers/cloudinaryUploader';
import { getFileByFileNameAndDelete } from '../middlewares/mongo/upload';

const util = new Util();
export default class ImagesController {
  static async registerImage(req, res) {
    try {
      const savedImage = await imagesService.createslidingImages({ title: req.body.title, type: req.body.type, image: req.files && req.files[0] ? req.files[0].filename : '' });
      util.setSuccess(200, 'Image Saved', savedImage);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getImages(req, res) {
    try {
      const type = req.params.type;
      const images = await imagesService.findByName({ type });
      util.setSuccess(200, 'Images Found', images);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async deleteimage(req, res) {
    try {
      const id = req.params.id;
      const slide = await imagesService.findById(id);
      getFileByFileNameAndDelete(slide.dataValues.image);
      const deleted = await imagesService.deleteslidingImages(id);
      util.setSuccess(200, 'Image Deleted', deleted);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
