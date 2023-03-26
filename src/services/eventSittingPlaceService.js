import models from '../models';

const { EventSittingPlace } = models;
/**
 * @exports
 * @class EventSittingPlaceService
 */
class EventSittingPlaceService {
  /**
   * create new user
   * @static createEventSittingPlace
   * @param {object} newEventSittingPlace
   * @memberof EventSittingPlaceService
   * @returns {object} data
   */
  static createEventSittingPlace(newEventSittingPlace, transaction) {
    return EventSittingPlace.create(newEventSittingPlace, { transaction });
  }

  static updateAtt(set, prop, transaction) {
    return EventSittingPlace.update(set, {
      returning: true,
      where: prop,
      transaction,
    });
  }

  static getEventSittingPlaces() {
    return EventSittingPlace.findAll();
  }

  /**
   * Find a User in storage using login credentials.
   * @param {*} prop HTTP request
   * @returns {*} JSON data
   */
  static findByName(prop) {
    return EventSittingPlace.findAll({
      where: prop,
    });
  }

  static findOneByName(prop) {
    return EventSittingPlace.findOne({
      where: prop,
    });
  }

  static findById(modelId) {
    return EventSittingPlace.findAll({
      where: { id: modelId },
    });
  }

  static incrementNumberOfPeople(id, transaction) {
    return EventSittingPlace.increment({ numberOfpeople: 1 }, { where: { id }, transaction });
  }

  static decrementPlaceLeft(id, transaction) {
    return EventSittingPlace.decrement({ placesLeft: 1 }, { where: { id }, transaction });
  }

  static deleteEventSittingPlace(modelId) {
    return EventSittingPlace.destroy({
      where: { id: modelId },
    });
  }
}

export default EventSittingPlaceService;
