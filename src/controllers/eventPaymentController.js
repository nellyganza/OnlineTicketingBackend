import eventPaymentService from '../services/eventPaymentService';
import Util from '../helpers/utils';

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
      const PaymentEvents = await eventPaymentService.findById(id);
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
      const PaymentEvents = await eventPaymentService.updateAtt({ ...req.body }, { id });
      if (!PaymentEvents) {
        util.setError(404, 'Event Payment  Not Updated');
        return util.send(res);
      }
      util.setSuccess(200, 'Event Payment  Update', PaymentEvents);
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
}
