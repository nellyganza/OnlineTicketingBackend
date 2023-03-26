import models from '../models';

const { PaymentMethod } = models;
/**
 * @exports
 * @class PaymentMethodService
 */
class PaymentMethodService {
  /**
   * create new user
   * @static createPaymentMethod
   * @param {object} newPaymentMethod
   * @memberof PaymentMethodService
   * @returns {object} data
   */
  static createPaymentMethod(newPaymentMethod, transaction) {
    return PaymentMethod.create(newPaymentMethod, { transaction });
  }

  static updateAtt(set, prop) {
    return PaymentMethod.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getPaymentMethods() {
    return PaymentMethod.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return PaymentMethod.findAll({
      where: prop,
    });
  }

  static incrementPaymentMade(id) {
    return PaymentMethod.increment({ paymentMade: 1 }, { where: { id } });
  }

  static findById(modelId) {
    return PaymentMethod.findAll({
      where: { id: modelId },
    });
  }

  static deletePaymentMethod(modelId) {
    return PaymentMethod.destroy({
      where: { id: modelId },
    });
  }
}
export default PaymentMethodService;
