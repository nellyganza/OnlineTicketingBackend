import models from '../models';

const { Op } = require('sequelize');

const {
  Event, Comment, EventPayment, EventSittingPlace, PaymentMethod,
} = models;
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
    return Event.findAll({
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }, { model: EventPayment }, { model: EventSittingPlace }, { model: PaymentMethod },
      ],
    });
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Event.findAll({
      where: prop,
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }, { model: EventPayment }, { model: EventSittingPlace }, { model: PaymentMethod }],
    });
  }

  static findByFilters(search, place, date) {
    return Event.findAll({
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
      }, { model: EventPayment }, { model: EventSittingPlace }, { model: PaymentMethod }],
    });
  }

  static findByFilters2(search, place, dateRange, date, category, country, host) {
    return Event.findAll({
      where: {
        [Op.and]: [
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
              [Op.between]: [dateRange[0], dateRange[1]],
            },
          },
          {
            dateAndTimme: {
              [Op.eq]: date,
            },
          },
          {
            category: {
              [Op.in]: category,
            },
          },
          {
            country: {
              [Op.in]: country,
            },
          },
          {
            host: {
              [Op.in]: host,
            },
          },
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
      }, { model: EventPayment }, { model: EventSittingPlace }, { model: PaymentMethod }],
    });
  }

  static findBetween(prop) {
    return Event.findAll({
      where: {
        dateAndTimme: { [Op.between]: [prop.startDate, prop.endDate] },
      },
      include: [{
        model: Comment,
        order: [
          ['createdAt', 'ASC'],
        ],
      }, { model: EventPayment }, { model: EventSittingPlace }, { model: PaymentMethod }],
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
      }, { model: EventPayment }, { model: EventSittingPlace }, { model: PaymentMethod }],
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
