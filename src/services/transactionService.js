import models from '../models';

const { Transactions } = models;
/**
 * @exports
 * @class TransactionService
 */
class TransactionService {
  /**
   * create new Transaction
   * @static createTransaction
   * @param {object} newTransaction
   * @memberof TransactionService
   * @returns {object} data
   */
  static createTransaction(newTransaction) {
    return Transactions.create(newTransaction);
  }

  static findByProp(prop) {
    return Transactions.findAll({
      where: prop,
    });
  }

  static updateAtt(set, prop) {
    return Transactions.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getTransactions() {
    return Transactions.findAll();
  }

  /**
   * Find a Transaction in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByTransactionRef(prop) {
    return Transactions.findOne({
      where: { transaction_ref: prop },
    });
  }

  static findById(modelId) {
    return Transactions.findOne({
      where: { id: modelId },
    });
  }

  static deleteById(modelId) {
    return Transactions.destroy({
      where: { id: modelId },
    });
  }
}
export default TransactionService;
