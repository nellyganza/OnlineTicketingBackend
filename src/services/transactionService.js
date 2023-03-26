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
  static async createTransaction(newTransaction) {
    const transaction = Transactions.build({
      eventId: newTransaction.eventId, ticketContent: newTransaction.customer, userId: newTransaction.userId, status: 'Pending', transaction_ref: newTransaction.tx_ref, order_id: newTransaction.order_id,
    });
    const saved = await transaction.save({ returning: true, attributes: ['id', 'transaction_ref', 'order_id', 'eventId', 'ticketContent', 'status', 'userId', 'createdAt', 'updatedAt'] });
    return saved;
  }

  static findByProp(prop) {
    return Transactions.findAll({
      where: prop,
    });
  }

  static findByOneByPropd(prop) {
    return Transactions.findOne({
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

  static findPayedTransactions(prop) {
    return Transactions.findOne({
      where: prop,
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
