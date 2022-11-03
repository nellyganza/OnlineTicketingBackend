import models from '../models';
import MainService from './MainService';

const { Op } = require('sequelize');

const {
  Event, Comment, EventPayment, EventSittingPlace, PaymentMethod,
} = models;
/**
 * @exports
 * @class EventService
 */
class EventService extends MainService {
  /**
   * create new user
   * @static createEvent
   * @param {object} newEvent
   * @memberof EventService
   * @returns {object} data
   */
  static createEvent(newEvent,transaction) {
    return Event.create(newEvent,{transaction});
  }

  static updateAtt(set, prop) {
    return Event.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getAll(page, size, prop) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Event.findAndCountAll({ where: condition, limit, offset }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getEvents(prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Event.findAndCountAll({
      where: condition,
      include: [{ model: Comment, order: [['createdAt', 'ASC']] }],
      limit,
      offset,
      distinct: true,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Event.findAndCountAll({
      where: prop,
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }],
      limit,
      offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getCalenderEvents() {
    return Event.findAll(
      {
        where: {
          status: 'Pending',
          share: true,
        },
        attributes: ['id', 'title', ['dateAndTimme', 'start']],
      },
    );
  }

  static findByFilters(search, place, date, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Event.findAndCountAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${search}%`,
            },
          },
          {
            place: {
              [Op.iLike]: `%${place}%`,
            },
          },
          {
            dateAndTimme: {
              [Op.between]: [date[0], date[1]],
            },
          },
        ],
        [Op.and]: [
          {
            status: 'Pending',
          },
        ],
      },
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }],
      limit,
      offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findByFilters2(name, place, category, dateRange, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    console.log(limit, offset);
    return Event.findAndCountAll({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            place: {
              [Op.iLike]: `%${place}%`,
            },
          },
          {
            dateAndTimme: {
              [Op.and]: dateRange ? [{ [Op.between]: [dateRange[0], dateRange[1]] }] : [{ [Op.iLike]: '%%' }],
            },
          },
          {
            eventType: {
              [Op.in]: category,
            },
          },
          {
            status: 'Pending',
          },
          {
            share: true,
          },
        ],
      },
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }],
      limit,
      offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static numberOfEvents() {
    return Event.count();
  }

  static findBetween(prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Event.findAndCountAll({
      where: {
        dateAndTimme: { [Op.between]: [prop.startDate, prop.endDate] },
      },
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }],
      limit,
      offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findById(modelId) {
    return Event.findOne({
      where: { id: modelId },
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }],
    });
  }

  static incrementNumberOfBought(id, t) {
    return Event.increment({ numberboughtticket: 1 }, { where: { id }, transaction: t });
  }

  static decrementTicketLeft(id, t) {
    return Event.decrement({ ticketLeft: 1 }, { where: { id }, transaction: t });
  }

  static deleteEvent(modelId) {
    return Event.destroy({
      where: { id: modelId },
    });
  }
}
export default EventService;
