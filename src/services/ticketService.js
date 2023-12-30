import { Op } from 'sequelize';
import models, { sequelize } from '../models';
import MainService from './MainService';

const { QueryTypes } = require('sequelize');

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
      include: [{ model: Users }, { model: Event }, { model: EventPayment }],
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
      include: [{ model: Users }, { model: Event }, { model: EventPayment }],
    });
  }

  static deleteTicket(modelId) {
    return Ticket.destroy({
      where: { id: modelId },
    });
  }

  static filterByHoster(userId, keyword, prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Ticket.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                paymenttype: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                fullName: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                nationalId: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                phoneNumber: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                email: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                status: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
            ],
          }, prop],
      },
      limit,
      offset,
      include: [{ model: Users }, { model: Event, where: { userId } }, { model: EventPayment }],
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getTicketsPerMonth(startDate, endDate, userId) {
    return sequelize.query(`select to_char(m, 'Month') as month,COUNT(t) as value
    from generate_series(
        ?::date, ?, '1 month'
    ) s(m) left join "Tickets" t on to_char(s.m::DATE, 'YYYY-MM') = to_char(t."createdAt"::TIMESTAMP, 'YYYY-MM') left join "Events" e on t."eventId"=e.id and e."userId"=?
    group by s.m
    order by s.m,value`, { replacements: [startDate, endDate, userId], type: QueryTypes.SELECT });
  }

  static filterUserTickets(prop, keyword, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Ticket.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                paymenttype: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                fullName: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                nationalId: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                phoneNumber: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                email: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                status: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
            ],
          }, prop],
      },
      limit,
      offset,
      include: [{ model: Users }, { model: Event }, { model: EventPayment }],
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }
}
export default TicketService;
