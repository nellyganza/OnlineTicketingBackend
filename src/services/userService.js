import { Op } from 'sequelize';
import models from '../models';

const {
  Users, Notification, Event, Comment, EventPayment, EventSittingPlace, PaymentMethod, Ticket,
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
      where: prop,
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
        attributes: ['id', 'email', 'firstName', 'lastName', 'RoleId', 'isVerified', 'status', 'phoneNumber', 'category', 'campanyName', 'profilePicture'],
      },
    );
  }

  static getAdminUsers() {
    return Users.findAll(
      {
        where: {
          RoleId: { [Op.in]: [2, 3] },
        },
        attributes: ['id', 'email', 'firstName', 'lastName', 'RoleId', 'isVerified', 'status', 'phoneNumber', 'category', 'campanyName', 'profilePicture'],
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
    });
  }

  static findById(modelId) {
    return Users.findOne({
      where: { id: modelId },
    });
  }

  static deleteById(modelId) {
    return Users.destroy({
      where: { id: modelId },
    });
  }
}
export default UserService;
