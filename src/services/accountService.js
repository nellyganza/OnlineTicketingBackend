import models from '../models';
import MainService from './MainService';

const { Account } = models;
/**
 * @exports
 * @class AccountService
 */
class AccountService extends MainService {
  /**
   * create new user
   * @static createAccount
   * @param {object} newAccount
   * @memberof AccountService
   * @returns {object} data
   */
  static createAccount(newAccount) {
    return Account.create(newAccount);
  }

  static updateAtt(set, prop) {
    return Account.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getAccounts(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Account.findAndCountAll({
      where: condition, limit, offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findById(modelId) {
    return Account.findOne({
      where: { id: modelId },
    });
  }

  static deleteAccount(modelId) {
    return Account.destroy({
      where: { id: modelId },
    });
  }
}
export default AccountService;
