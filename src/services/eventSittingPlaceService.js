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
  static createEventSittingPlace(newEventSittingPlace) {
    return EventSittingPlace.create(newEventSittingPlace);
  }

  static updateAtt(set, prop) {
    return EventSittingPlace.update(set, {
      returning: true,
      where: prop,
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

  static incrementNumberOfPeople(id) {
    return EventSittingPlace.increment({ numberOfpeople: 1 }, { where: { id } });
  }

  static decrementPlaceLeft(id) {
    return EventSittingPlace.decrement({ placesLeft: 1 }, { where: { id } });
  }

  static deleteEventSittingPlace(modelId) {
    return EventSittingPlace.destroy({
      where: { id: modelId },
    });
  }
}

export default EventSittingPlaceService;
