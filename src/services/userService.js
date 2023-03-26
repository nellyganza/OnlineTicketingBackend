import { Op } from 'sequelize';
import models from '../models';

const {
  Users, Notification, Event, Comment, EventPayment, EventSittingPlace, PaymentMethod, Roles,
} = models;
/**
 * @exports
 * @class UserService
 */
class UserService {
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

  static findByProp(prop) {
    return Users.findAll({
      where: prop, include: [{ model: Roles, attributes: ['id', 'name', 'slug'] }],
    });
  }

  static numberOfUsers() {
    return Users.count();
  }

  static findByAllData(prop) {
    return Users.findOne({
      where: prop,
      include: [
        {
          model: Event,
          include: [{
            model: Comment,
            order: [
              ['createdAt', 'ASC'],
            ],
          }, { model: EventPayment }, { model: EventSittingPlace }, { model: PaymentMethod },
          ],
        },
        {
          model: Notification,
        },
      ],
      attributes: { exclude: ['password', 'authToken'] },
    });
  }

  static updateAtt(set, prop) {
    return Users.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getUsers() {
    return Users.findAll(
      {
        where: {
          isVerified: true,
        },
        include: [{ model: Roles, attributes: ['id', 'name', 'slug'] }],
        attributes: ['id', 'email', 'firstName', 'lastName', 'RoleId', 'isVerified', 'status', 'phoneNumber', 'category', 'campanyName', 'profilePicture'],
      },
    );
  }

  static getAdminUsers() {
    return Users.findAll(
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
    );
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
