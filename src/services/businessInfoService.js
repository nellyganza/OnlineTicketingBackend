import models from '../models';
import MainService from './MainService';

const { BusinessInfo, Account, Representative } = models;
/**
 * @exports
 * @class BusinessInfoService
 */
class BusinessInfoService extends MainService {
  /**
   * create new user
   * @static createBusinessInfo
   * @param {object} newBusinessInfo
   * @memberof BusinessInfoService
   * @returns {object} data
   */
  static createBusinessInfo(newBusinessInfo) {
    return BusinessInfo.create(newBusinessInfo);
  }

  static updateAtt(set, prop) {
    return BusinessInfo.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getBusinessInfos(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return BusinessInfo.findAndCountAll({
      where: condition, limit, offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findByUserId(modelId) {
    return BusinessInfo.findOne({
      where: { userId: modelId }, include: [{ model: Account }, { model: Representative }],
    });
  }

  static findById(modelId) {
    return BusinessInfo.findOne({
      where: { id: modelId },
    });
  }

  static deleteBusinessInfo(modelId) {
    return BusinessInfo.destroy({
      where: { id: modelId },
    });
  }
}
export default BusinessInfoService;
