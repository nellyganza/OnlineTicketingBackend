import { Op } from 'sequelize';
import models from '../models';
import MainService from './MainService';

const {
  Ticket, Event, Users, EventPayment, PaymentMethod,
} = models;
/**
 * @exports
 * @class TicketService
 */
class TicketService extends MainService {
  /**
   * create new user
   * @static createTicket
   * @param {object} newTicket
   * @memberof TicketService
   * @returns {object} data
   */
  static createTicket(newTicket, t) {
    return Ticket.create(newTicket, { transaction: t });
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

  static totalIcome() {
    return Ticket.sum('price');
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Ticket.findAndCountAll({
      where: prop,
      limit,
      offset,
      include: [
        { model: Users }, { model: Event, include: [{ model: PaymentMethod }, { model: EventPayment }] },
      ],
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
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

  static findBynationalId(prop) {
    return Ticket.findOne({
      where: prop,
    });
  }

  static findByTicketsExists(eventId, nationIds) {
    return Ticket.findAll({
      where: {
        [Op.and]: [
          { eventId },
          { nationalId: { [Op.in]: nationIds } },
        ],
      },
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
