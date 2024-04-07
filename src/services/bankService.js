import models from '../models';
import MainService from './MainService';

const { Bank } = models;
/**
 * @exports
 * @class BankService
 */
class BankService extends MainService {
  /**
   * create new user
   * @static createBank
   * @param {object} newBank
   * @memberof BankService
   * @returns {object} data
   */
  static createBank(newBank) {
    return Bank.create(newBank);
  }

  static updateAtt(set, prop) {
    return Bank.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getBanks(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Bank.findAndCountAll({
      where: condition, limit, offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findById(modelId) {
    return Bank.findOne({
      where: { id: modelId },
    });
  }

  static deleteBank(modelId) {
    return Bank.destroy({
      where: { id: modelId },
    });
  }
}
export default BankService;
