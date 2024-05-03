import { getAndUpdateSittingPlace } from '../helpers/ControllerFunctions';
import { eventEmitter } from '../helpers/notifications/eventEmitter';
import Util from '../helpers/utils';
import { sequelize } from '../models';
import eventPaymentService from '../services/eventPaymentService';
import eventService from '../services/eventService';
import eventStittingPlaceService from '../services/eventSittingPlaceService';
import eventPaymentMethodService from '../services/paymentMethodService';

const util = new Util();
export default class EventController {
  static async saveEvent(req, res) {
    const { id } = req.userInfo;
    const {
      event, paymentMethod, paymentGradeCost,
    } = req.body;
    let { sittingPlace } = req.body;
    if (!event || !paymentMethod || !sittingPlace || !paymentGradeCost) {
      util.setError(400, 'Bad Information Provided');
      return util.send(res);
    }
    sittingPlace = JSON.parse(sittingPlace);
    const transaction = await sequelize.transaction();
    const saveEvent = { ...event, ticketLeft: event.numberofTicket, userId: id };
    try {
      const savedEvent = await eventService.createEvent(saveEvent, transaction);
      if (!savedEvent) {
        util.setError(400, 'Event not Created');
        return util.send(res);
      }

      const methodkeys = Object.keys(paymentMethod);
      const savedMethods = [];
      for (let index = 0; index < methodkeys.length; index++) {
        const method = methodkeys[index];
        const savedPayment = await eventPaymentMethodService.createPaymentMethod({ ...paymentMethod[method], eventId: savedEvent.id }, transaction);
        savedMethods.push({ ...savedPayment.dataValues });
      }

      const sittingkeys = Object.keys(sittingPlace);
      for (let index = 0; index < sittingkeys.length; index++) {
        const sitti = sittingkeys[index];
        await eventStittingPlaceService.createEventSittingPlace({ ...sittingPlace[sitti], eventId: savedEvent.id, placesLeft: sittingPlace[sitti].totalPlaces }, transaction);
      }

      const gradeKeys = Object.keys(paymentGradeCost);
      for (let index = 0; index < gradeKeys.length; index++) {
        const grade = gradeKeys[index];
        await eventPaymentService.createEventPayment({ ...paymentGradeCost[grade], eventId: savedEvent.id }, transaction);
      }

      transaction.afterCommit(async () => {
        util.setSuccess(201, 'Events Prepared Success', { savedEvent });
        eventEmitter.emit('createdEvent', { user: req.userInfo, event: { ...savedEvent.dataValues }, paymentMethod: savedMethods });
        return util.send(res);
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getEventById(req, res) {
    try {
      const eventId = req.params.eventId;
      const event = await eventService.findById(eventId);
      if (event) {
        return res.send({ event });
      }
      return res.status(400).send({ message: 'Event Not Found' });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  static async getFillteredEvents1(req, res) {
    try {
      const {
        title, category, page, size,
      } = req.query;
      const date = req.query.date ? req.query.date.split(',') : [];
      const result = await eventService.findByFilters(title, category, date, page, size);
      if (result) {
        util.setSuccess(200, 'Events Found', result);
        return util.send(res);
      }
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getFillteredEvents(req, res) {
    try {
      const {
        name, place,
      } = req.query;
      const { page, size } = req.query;
      const category = req.query.category ? req.query.category.split(',') : [];
      const result = await eventService.findByFilters2(name, place, category, undefined, page, size);
      if (result) {
        util.setSuccess(200, 'Events Found', result);
        return util.send(res);
      }
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getAllEvent(req, res) {
    try {
      const { page, size, ...others } = req.query;

      const events = await eventService.getEvents({ ...others }, page, size);
      if (!events) {
        util.setError(404, 'Events Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Found', events);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getAllEventByUser(req, res) {
    try {
      const { id } = req.userInfo;
      const { page, size, keyword } = req.query;
      const date = req.query.date ? req.query.date.split(',') : [];
      const events = await eventService.findByName({ userId: id }, keyword, date, page, size);
      if (!events) {
        util.setError(404, 'Events Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Found', events);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getEventCalenderDate(req, res) {
    try {
      const events = await eventService.getCalenderEvents();
      util.setSuccess(200, 'Events', events);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findBetween(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const events = await eventService.findBetween({ startDate, endDate });
      if (!events) {
        util.setError(404, 'Events Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Found', events);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.body;
      if (!id) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const event = await eventService.updateAtt({ ...req.body }, { id });
      if (!event) {
        util.setError(404, 'Event not Updated');
        return util.send(res);
      }
      console.log(event);
      util.setSuccess(200, 'Event Updated Success', event);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const event = await eventService.deleteEvent(eventId);
      if (!event) {
        util.setError(404, 'Event not Deleted');
        return util.send(res);
      }
      util.setSuccess(200, 'Event Deleted Success', event);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getTicketNumber(req, res) {
    try {
      const { eventId } = req.params;
      const { numberofTickets, type } = req.query;
      if (!numberofTickets) {
        util.setError(400, 'Please Select number of tickets you need');
        util.send(res);
      }
      const event = await eventService.findById(eventId);
      const events = { ...event };
      if (events.dataValues.ticketLeft < numberofTickets) {
        util.setError(400, `Only ${events.dataValues.ticketLeft} tickets left`);
        util.send(res);
      }
      const places = await getAndUpdateSittingPlace(eventId, type, 'getPlaces');
      util.setSuccess(200, 'Tickets Available', places);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      util.send(res);
    }
  }
}
