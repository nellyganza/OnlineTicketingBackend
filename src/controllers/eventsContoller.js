import eventService from '../services/eventService';
import eventStittingPlaceService from '../services/eventSittingPlaceService';
import eventPaymentService from '../services/eventPaymentService';
import eventPaymentMethodService from '../services/paymentMethodService';
import { getAndUpdateSittingPlace } from '../helpers/ControllerFunctions';
import Util from '../helpers/utils';

const util = new Util();
export default class eventController {
  static async saveEvent(req, res) {
    console.log('Saving Event');
    const { id } = req.userInfo;
    const {
      event, paymentMethod, sittingPlace, paymentGradeCost,
    } = req.body;
    if (!event || !paymentMethod || !sittingPlace || !paymentGradeCost) {
      util.setError(400, 'Bad Information Provided');
      return util.send(res);
    }
    const saveEvent = { ...event, ticketLeft: event.numberofTicket, userId: id };
    try {
      const savedEvent = await eventService.createEvent(saveEvent);
      if (!savedEvent) {
        util.setError(400, 'Event not Created');
        return util.send(res);
      }
      Object.keys(paymentMethod).forEach(async (method) => {
        await eventPaymentMethodService.createPaymentMethod({ ...paymentMethod[method], eventId: savedEvent.id });
      });
      Object.keys(sittingPlace).forEach(async (sitti) => {
        await eventStittingPlaceService.createEventSittingPlace({ ...sittingPlace[sitti], eventId: savedEvent.id, placesLeft: sittingPlace[sitti].totalPlaces });
      });
      Object.keys(paymentGradeCost).forEach(async (grade) => {
        await eventPaymentService.createEventPayment({ ...paymentGradeCost[grade], eventId: savedEvent.id });
      });
      util.setSuccess(201, 'Events Prepared Success', { savedEvent });
      return util.send(res);
    } catch (error) {
      util.setError(500, error);
      console.log(error);
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
      const { search, place, date } = req.query;
      const result = await eventService.findByFilters(search, place, date);
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
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = (page * limit);
      const result = {};
      result.next = {
        page: page + 1,
        limit,
      };
      if (startIndex > 0) {
        result.prev = {
          page: page - 1,
          limit,
        };
      }
      const data = { ...req.query };
      delete data.page;
      delete data.limit;
      const events = await eventService.findByName({ ...data });
      result.result = events.slice(startIndex, endIndex);
      if (!result) {
        util.setError(404, 'Events Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Found', result);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getAllEventByUser(req, res) {
    try {
      const { id } = req.userInfo;
      const events = await eventService.findByName({ userId: id });
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
      const { eventId } = req.params;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const event = await eventService.updateAtt({ ...req.body }, { id: eventId });
      if (!event) {
        util.setError(404, 'Event not Updated');
        return util.send(res);
      }
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
