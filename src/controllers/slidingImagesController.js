import Util from '../helpers/utils';
import imagesService from '../services/slidingImageService';

const fs = require('fs');

const util = new Util();
export default class imagesController {
  static async registerImage(req, res) {
    try {
      const savedimage = await imagesService.createslidingImages({ title: req.body.title, image: fs.readFileSync(req.files[0].path) });
      util.setSuccess(200, 'Image Saved', savedimage);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getImages(req, res) {
    try {
      const images = await imagesService.getslidingImagess();
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
