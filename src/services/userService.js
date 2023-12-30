import { Op } from 'sequelize';
import models from '../models';
import MainService from './MainService';

const {
  Users, Notification, Event, Comment, EventPayment, EventSittingPlace, PaymentMethod, Roles,
} = models;
/**
 * @exports
 * @class UserService
 */
class UserService extends MainService {
  /**
   * create new user
   * @static createuser
   * @param {object} newuser
   * @memberof userService
   * @returns {object} data
   */
  static createuser(newUser) {
    return Users.create(newUser);
  }

  static findByProp(prop, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Users.findAndCountAll({
      where: prop,
      include: [{ model: Roles, attributes: ['id', 'name', 'slug'] }],
      limit,
      offset,
    }).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static numberOfUsers() {
    return Users.count();
  }

  static findByAllData(prop) {
    return Users.findOne({
      where: prop,
      attributes: { exclude: ['password', 'authToken'] },
    });
  }

  static updateAtt(set, prop) {
    return Users.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getUsers(page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Users.findAndCountAll(
      {
        where: {
          isVerified: true,
        },
        include: [{ model: Roles, attributes: ['id', 'name', 'slug'] }],
        attributes: ['id', 'email', 'firstName', 'lastName', 'RoleId', 'isVerified', 'status', 'phoneNumber', 'category', 'campanyName', 'profilePicture'],
      },
      limit,
      offset,
    ).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static getAdminUsers(page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Users.findAndCountAll(
      {
        include: [{
          model: Roles,
          where: {
            slug: { [Op.in]: ['manager', 'event_admin'] },
          },
          attributes: ['id', 'name', 'slug'],
        }],
        attributes: ['id', 'email', 'firstName', 'lastName', 'RoleId', 'isVerified', 'status', 'phoneNumber', 'category', 'campanyName', 'profilePicture', 'share'],
      },
      limit,
      offset,
    ).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByEmail(prop) {
    return Users.findOne({
      where: { email: prop },
      include: [{ model: Roles, attributes: ['id', 'name', 'slug'] }],
    });
  }

  static findById(modelId) {
    return Users.findOne({
      where: { id: modelId }, include: [{ model: Roles, attributes: ['id', 'name', 'slug'] }],
    });
  }

  static deleteById(modelId) {
    return Users.destroy({
      where: { id: modelId },
    });
  }
}
export default UserService;
