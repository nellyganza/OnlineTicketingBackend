import models from '../models';
import MainService from './MainService';

const { Ads, AdsPosition } = models;
/**
 * @exports
 * @class AdsService
 */
class AdsService extends MainService {
  /**
   * create new user
   * @static createAds
   * @param {object} newAds
   * @memberof AdsService
   * @returns {object} data
   */
  static createAds(newAds) {
    return Ads.create(newAds);
  }

  static updateAtt(set, prop) {
    return Ads.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getAds(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Ads.findAndCountAll({
      where: condition, include: [{ model: AdsPosition }], limit, offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findById(modelId) {
    return Ads.findOne({
      where: { id: modelId },
    });
  }

  static deleteAds(modelId) {
    return Ads.destroy({
      where: { id: modelId },
    });
  }

  static createPosition(position) {
    return AdsPosition.create(position);
  }

  static updateAtPosition(set, prop) {
    return AdsPosition.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getAllPosition(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return AdsPosition.findAndCountAll({ where: condition, limit, offset }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }
}
export default AdsService;
