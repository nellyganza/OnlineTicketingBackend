import models, { sequelize } from '../models';
import MainService from './MainService';

const { Op, QueryTypes } = require('sequelize');

const {
  Event, Comment, EventPayment, EventSittingPlace, PaymentMethod, Category,
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
  static createEvent(newEvent, transaction) {
    return Event.create(newEvent, { transaction });
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
    return Event.findAndCountAll({
      where: condition,
      include: [{ model: Category }],
      limit,
      offset,
      order: [
        ['status', 'DESC'],
        ['dateAndTimme', 'ASC'],
      ],
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getAllByStatus(page, size, states) {
    const { limit, offset } = this.getPagination(page, size);
    return Event.findAndCountAll({
      where: {
        status: {
          [Op.in]: states,
        },
      },
      include: [{ model: Category }],
      limit,
      offset,
      order: [
        ['status', 'DESC'],
        ['dateAndTimme', 'ASC'],
      ],
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getAllCount(prop) {
    const condition = prop || null;
    return Event.count({
      where: condition,
    }).then((data) => data)
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getEvents(prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    const condition = prop || null;
    return Event.findAndCountAll({
      where: condition,
      include: [{ model: Category }],
      limit,
      offset,
      distinct: true,
      order: [
        ['status', 'DESC'],
        ['dateAndTimme', 'ASC'],
      ],
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
  static findByName(prop, keyword, date, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Event.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                title: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                place: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
            ],
          },
          {
            dateAndTimme: {
              [Op.between]: [date[0], date[1]],
            },
          }, prop],
      },
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }, { model: Category }, { model: EventPayment }],
      limit,
      offset,
      order: [
        ['status', 'DESC'],
        ['dateAndTimme', 'ASC'],
      ],
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
        attributes: ['id', 'title', 'host', ['dateAndTimme', 'start']],
      },
      { model: Category, attributes: ['id', 'name'] },
    );
  }

  static findByFilters(title, category, date, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Event.findAndCountAll({
      where: {
        [Op.and]: [
          {
            title: {
              [Op.iLike]: `%${title}%`,
            },
          },
          {
            dateAndTimme: {
              [Op.between]: [date[0], date[1]],
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
      }, {
        model: Category,
        where: {
          name: {
            [Op.iLike]: `%${category}%`,
          },
        },
      }],
      limit,
      offset,
      order: [
        ['status', 'DESC'],
        ['dateAndTimme', 'ASC'],
      ],
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static findByFilters2(name, place, category, dateRange, page, size) {
    const { limit, offset } = this.getPagination(page, size);
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
            categoryId: {
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
      }, { model: Category }],
      limit,
      offset,
      order: [
        ['status', 'DESC'],
        ['dateAndTimme', 'ASC'],
      ],
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
      }, { model: Category }],
      limit,
      offset,
      order: [
        ['status', 'DESC'],
        ['dateAndTimme', 'ASC'],
      ],
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

  static getEventsPerMonth(startDate, endDate, userId) {
    return sequelize.query(`select to_char(m, 'Month') as month,COUNT(e) as value
    from generate_series(
        ?::date, ?, '1 month'
    ) s(m) left join "Events" e on to_char(s.m::DATE, 'YYYY-MM') = to_char(e."dateAndTimme"::TIMESTAMP, 'YYYY-MM') and e."userId"=?
    group by s.m
    order by s.m,value`, { replacements: [startDate, endDate, userId], type: QueryTypes.SELECT });
  }
}
export default EventService;
