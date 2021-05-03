import models from '../models';

const { Users } = models;
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

  static updateAtt(set, prop) {
    return Users.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getUsers(id) {
    return Users.findAll(
      {
        where: {
          isVerified: true,
        },
        attributes: ['id', 'email', 'RoleId', 'isVerified'],
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
