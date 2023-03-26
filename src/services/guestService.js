import models from '../models';

const { Guest, EventPayment } = models;
/**
 * @exports
 * @class GuestService
 */
class GuestService {
  /**
   * create new user
   * @static createGuest
   * @param {object} newGuest
   * @memberof GuestService
   * @returns {object} data
   */
  static createGuest(newGuest) {
    return Guest.create(newGuest);
  }

  static updateAtt(set, prop) {
    return Guest.upsert(set, {
      returning: true,
      where: prop,
    });
  }

  static getGuests(eventId) {
    return Guest.findAll({
      where: { eventId },
      include: [{ model: EventPayment }],
    });
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Guest.findOne({
      where: prop,
      include: [{ model: EventPayment }],
    });
  }

  static findById(modelId) {
    return Guest.findOne({
      where: { id: modelId },
      include: [{ model: EventPayment }],
    });
  }

  static deleteGuest(modelId) {
    return Guest.destroy({
      where: { id: modelId },
    });
  }
}
export default GuestService;
