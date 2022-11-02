import models from '../models';

const { Clients } = models;
/**
 * @exports
 * @class ClientsService
 */
class ClientsService {
  /**
   * create new user
   * @static createClients
   * @param {object} newClients
   * @memberof ClientsService
   * @returns {object} data
   */
  static createClients(newClients) {
    return Clients.create(newClients);
  }

  static updateAtt(set, prop) {
    return Clients.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getClientss() {
    return Clients.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Clients.findAll({
      where: prop,
    });
  }

  static findById(modelId) {
    return Clients.findOne({
      where: { id: modelId },
    });
  }

  static deleteClients(modelId) {
    return Clients.destroy({
      where: { id: modelId },
    });
  }
}
export default ClientsService;
