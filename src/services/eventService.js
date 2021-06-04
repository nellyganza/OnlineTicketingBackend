import models from '../models';

const { Op } = require('sequelize');

const { Event } = models;
/**
 * @exports
 * @class EventService
 */
class EventService {
  /**
   * create new user
   * @static createEvent
   * @param {object} newEvent
   * @memberof EventService
   * @returns {object} data
   */
  static createEvent(newEvent) {
    return Event.create(newEvent);
  }

  static updateAtt(set, prop) {
    return Event.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getEvents() {
    return Event.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Event.findAll({
      where: prop,
    });
  }

  static findBetween(prop) {
    return Event.findAll({
      where: {
        dateAndTimme: { [Op.between]: [prop.startDate, prop.endDate] },
      },
    });
  }

  static findById(modelId) {
    return Event.findOne({
      where: { id: modelId },
    });
  }

  static incrementNumberOfBought(id) {
    return Event.increment({ numberboughtticket: 1 }, { where: { id } });
  }

  static decrementTicketLeft(id) {
    return Event.decrement({ ticketLeft: 1 }, { where: { id } });
  }

  static deleteEvent(modelId) {
    return Event.destroy({
      where: { id: modelId },
    });
  }
}
export default EventService;
