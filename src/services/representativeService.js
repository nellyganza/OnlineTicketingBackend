import models from '../models';
import MainService from './MainService';

const { Representative } = models;
/**
 * @exports
 * @class RepresentativeService
 */
class RepresentativeService extends MainService {
  /**
   * create new user
   * @static createRepresentative
   * @param {object} newRepresentative
   * @memberof RepresentativeService
   * @returns {object} data
   */
  static createRepresentative(newRepresentative) {
    return Representative.create(newRepresentative);
  }

  static updateAtt(set, prop) {
    return Representative.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getRepresentatives(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Representative.findAndCountAll({
      where: condition, limit, offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findById(modelId) {
    return Representative.findOne({
      where: { id: modelId },
    });
  }

  static deleteRepresentative(modelId) {
    return Representative.destroy({
      where: { id: modelId },
    });
  }
}
export default RepresentativeService;
