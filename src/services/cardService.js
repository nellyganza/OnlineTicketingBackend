import models from '../models';

const { Card } = models;
/**
 * @exports
 * @class CardService
 */
class CardService {
  /**
   * create new user
   * @static createCard
   * @param {object} newCard
   * @memberof CardService
   * @returns {object} data
   */
  static createCard(newCard) {
    return Card.create(newCard);
  }

  static updateAtt(set, prop) {
    return Card.update(set, {
      returning: true,
      where: prop,
    });
  }

  static getCards() {
    return Card.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return Card.findAll({
      where: prop,
    });
  }

  static findById(modelId) {
    return Card.findOne({
      where: { id: modelId },
    });
  }

  static deleteCard(modelId) {
    return Card.destroy({
      where: { id: modelId },
    });
  }
}
export default CardService;
