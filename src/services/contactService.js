import models from '../models';

const { Contact } = models;
/**
 * @exports
 * @class ContactService
 */
class ContactService {
  /**
   * create new user
   * @static createContact
   * @param {object} newContact
   * @memberof ContactService
   * @returns {object} data
   */
  static createContact(newContact) {
    return Contact.create(newContact);
  }

  static numberOfMessages() {
    return Contact.count();
  }

  static updateAtt(set, prop) {
    return Contact.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getContacts() {
    return Contact.findAll(
      { order: [['createdAt', 'ASC']] },
    );
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Contact.findOne({
      where: prop,
    });
  }

  static findById(modelId) {
    return Contact.findOne({
      where: { id: modelId },
    });
  }

  static deleteContact(modelId) {
    return Contact.destroy({
      where: { id: modelId },
    });
  }
}
export default ContactService;
