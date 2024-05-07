import Util from '../helpers/utils';
import eventPaymentService from '../services/eventPaymentService';

const util = new Util();
export default class EventPaymentController {
  static async createPaymentByEId(req, res) {
    try {
      const { eventId } = req.body;
      delete req.body.id;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const PaymentEvents = await eventPaymentService.createEventPayment({ ...req.body });
      if (!PaymentEvents) {
        util.setError(404, 'Event Payment  Not Created');
        return util.send(res);
      }
      util.setSuccess(201, 'Event Payment  Created', PaymentEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findByID(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        util.setError(400, 'Invalid  Id');
        return util.send(res);
      }
      const paymentEvents = await eventPaymentService.findById(id);
      console.log(paymentEvents);
      if (!paymentEvents) {
        util.setError(404, 'Events Payment  Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Payment  Found', paymentEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getAllPaymentByEId(req, res) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const PaymentEvents = await eventPaymentService.findByName({ eventId });
      if (!PaymentEvents) {
        util.setError(404, 'Events Payment  Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Payment  Found', PaymentEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updatePaymentPlaceByPId(req, res) {
    try {
      const { id } = req.params; 
      if (!id) {
        util.setError(400, 'Invalid Place Id');
        return util.send(res);
      }
      const paymentEvents = await eventPaymentService.updateAtt({ ...req.body }, { id });
      if (!paymentEvents) {
        util.setError(404, 'Event Payment  Not Updated');
        return util.send(res);
      }
      util.setSuccess(200, 'Event Payment  Update', paymentEvents[0]);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async deletePaymentPlaceByPId(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        util.setError(400, 'Invalid Payment  Id');
        return util.send(res);
      }
      const PaymentEvents = await eventPaymentService.deleteEventPayment(id);
      if (!PaymentEvents) {
        util.setError(404, 'Events Payment  Not Deleted');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Payment  Deleted', PaymentEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  // Event Validators
  static async createEventValidator(req, res) {
    try {
      const {
        eventPaymentId, userId, status, id,
      } = req.body;
      console.log({
        eventPaymentId, userId, status, id,
      });
      const savedValidator = await eventPaymentService.updateEventValidator({
        id, eventPaymentId, userId, status,
      }, { id });
      if (!savedValidator) {
        util.setError(404, 'Event Validator  Not Assigned');
        return util.send(res);
      }
      util.setSuccess(201, 'Event Validator Assigned', savedValidator);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getEventValidatorsByProp(req, res) {
    try {
      const {
        page, size, eventId, ...others
      } = req.query;

      const events = await eventPaymentService.findEventValidatorByProp(page, size, eventId, { ...others });
      if (!events) {
        util.setError(404, 'Event Validator Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Event Validator Found', events);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
