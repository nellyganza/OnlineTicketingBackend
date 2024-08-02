import models from '../models';
import MainService from './MainService';

const {
  EventPayment, VaidatorEvent, Users, Event,
} = models;
/**
 * @exports
 * @class EventPaymentService
 */
class EventPaymentService extends MainService {
  /**
   * create new user
   * @static createEventPayment
   * @param {object} newEventPayment
   * @memberof EventPaymentService
   * @returns {object} data
   */
  static createEventPayment(newEventPayment, transaction) {
    return EventPayment.create(newEventPayment, { transaction });
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
    return EventPayment.findOne({
      where: { id: modelId },
      include: [{ model: Event }]
    });
  }

  static findOneById(modelId) {
    return EventPayment.findOne({
      where: { id: modelId },
    });
  }

  static incrementPaymentGrade(id, transaction) {
    return EventPayment.increment({ boughtTickets: 1 }, { where: { id }, transaction });
  }

  static deleteEventPayment(modelId) {
    return EventPayment.destroy({
      where: { id: modelId },
    });
  }
  // Validator Event

  static createEventValidator(eventValidator) {
    return VaidatorEvent.create(eventValidator);
  }

  static updateEventValidator(set, prop) {
    return VaidatorEvent.upsert(set, {
      returning: true,
      where: prop,
    });
  }

  static findEventValidatorById(modelId) {
    return VaidatorEvent.findOne({
      where: { id: modelId }, include: [{ model: EventPayment }, { model: Users }],
    });
  }

  static findEventValidatorByProp(page, size, id, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    const eventId = id ? { eventId: id } : null;
    return VaidatorEvent.findAndCountAll({
      where: condition,
      include: [{ model: EventPayment, where: eventId, include: [{ model: Event }] }, { model: Users, attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'profilePicture'] }],
      limit,
      offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }
}
export default EventPaymentService;
