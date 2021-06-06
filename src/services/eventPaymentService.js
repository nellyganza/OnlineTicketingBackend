import models from '../models';

const { EventPayment } = models;
/**
 * @exports
 * @class EventPaymentService
 */
class EventPaymentService {
  /**
   * create new user
   * @static createEventPayment
   * @param {object} newEventPayment
   * @memberof EventPaymentService
   * @returns {object} data
   */
  static createEventPayment(newEventPayment) {
    return EventPayment.create(newEventPayment);
  }

  static updateAtt(set, prop) {
    return EventPayment.upsert(set, {
      returning: true,
      where: prop,
    });
  }

  static getEventPayments() {
    return EventPayment.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return EventPayment.findAll({
      where: prop,
    });
  }

  static findById(modelId) {
    return EventPayment.findAll({
      where: { id: modelId },
    });
  }

  static findOneById(modelId) {
    return EventPayment.findOne({
      where: { id: modelId },
    });
  }

  static incrementPaymentGrade(id) {
    return EventPayment.increment({ boughtTickets: 1 }, { where: { id } });
  }

  static deleteEventPayment(modelId) {
    return EventPayment.destroy({
      where: { id: modelId },
    });
  }
}
export default EventPaymentService;
