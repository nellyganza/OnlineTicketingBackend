import { Op } from 'sequelize';
import models from '../models';
import MainService from './MainService';

const { Guest, EventPayment, Event } = models;
/**
 * @exports
 * @class GuestService
 */
class GuestService extends MainService {
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

  static filterByHoster(userId, keyword, prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Guest.findAndCountAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                fullName: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                email: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                phoneNumber: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                nationalId: {
                  [Op.iLike]: `%${keyword}%`,
                },
              },
              {
                organization: {
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
      include: [{ model: Event, where: { userId } }, { model: EventPayment },
      ],
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }
}
export default GuestService;
