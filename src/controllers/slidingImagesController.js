import Util from '../helpers/utils';
import imagesService from '../services/slidingImageService';
import { cloudinaryUploader } from '../helpers/cloudinaryUploader';

const util = new Util();
export default class imagesController {
  static async registerImage(req, res) {
    try {
      const url = await cloudinaryUploader(req.files[0].path);
      const savedImage = await imagesService.createslidingImages({ title: req.body.title, type: req.body.type, image: url });
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
      const deleted = await imagesService.deleteslidingImages(id);
      util.setSuccess(200, 'Image Deleted', deleted);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
