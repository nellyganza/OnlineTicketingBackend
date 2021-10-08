import models from '../models';

const { slidingImages } = models;
/**
 * @exports
 * @class slidingImagesService
 */
class slidingImagesService {
  /**
   * create new user
   * @static createslidingImages
   * @param {object} newslidingImages
   * @memberof slidingImagesService
   * @returns {object} data
   */
  static createslidingImages(newslidingImages) {
    return slidingImages.create(newslidingImages);
  }

  static updateAtt(set, prop) {
    return slidingImages.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getslidingImagess() {
    return slidingImages.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return slidingImages.findAll({
      where: prop,
    });
  }

  static findById(modelId) {
    return slidingImages.findOne({
      where: { id: modelId },
    });
  }

  static deleteslidingImages(modelId) {
    return slidingImages.destroy({
      where: { id: modelId },
    });
  }
}
export default slidingImagesService;
