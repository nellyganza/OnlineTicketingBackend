import { Op, QueryTypes } from 'sequelize';
import models from '../models';

const { Ticket } = models;
/**
 * @exports
 * @class TicketService
 */
class TicketService {
  /**
   * create new user
   * @static createTicket
   * @param {object} newTicket
   * @memberof TicketService
   * @returns {object} data
   */
  static createTicket(newTicket) {
    return Ticket.create(newTicket);
  }

  static updateAtt(set, prop) {
    return Ticket.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getTickets() {
    return Ticket.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Ticket.findAll({
      where: prop,
    });
  }

  static findByUserANDEvent(prop) {
    return Ticket.findAll({
      where: {
        [Op.and]: [
          { userId: prop.userId },
          { eventId: prop.eventId },
        ],
      },
    });
  }

  static findByCardNumber(prop) {
    return Ticket.findOne({
      where: prop,
    });
  }

  static findById(modelId) {
    return Ticket.findOne({
      where: { id: modelId },
    });
  }

  static deleteTicket(modelId) {
    return Ticket.destroy({
      where: { id: modelId },
    });
  }
}
export default TicketService;
