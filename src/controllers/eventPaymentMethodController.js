import eventPaymentService from '../services/paymentMethodService';
import Util from '../helpers/utils';

const util = new Util();
export default class eventPaymentController {
  static async createPaymentMethodByEId(req, res) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const PaymentMethodEvents = await eventPaymentService.createPaymentMethod({ ...req.body });
      if (!PaymentMethodEvents) {
        util.setError(404, 'Event Payment Method Not Created');
        return util.send(res);
      }
      util.setSuccess(201, 'Event Payment Method Created', PaymentMethodEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getAllPaymentMethodByEId(req, res) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const PaymentMethodEvents = await eventPaymentService.findByName({ eventId });
      if (!PaymentMethodEvents) {
        util.setError(404, 'Events Payment Method Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Payment Method Found', PaymentMethodEvents);
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
      const PaymentMethodEvents = await eventPaymentService.updateAtt({ ...req.body }, { id });
      if (!PaymentMethodEvents) {
        util.setError(404, 'Event Payment Method Not Updated');
        return util.send(res);
      }
      util.setSuccess(200, 'Event Payment Method Update', PaymentMethodEvents);
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
        util.setError(400, 'Invalid Payment Method Id');
        return util.send(res);
      }
      const PaymentMethodEvents = await eventPaymentService.deletePaymentMethod({ id });
      if (!PaymentMethodEvents) {
        util.setError(404, 'Events Payment Method Not Deleted');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Payment Method Deleted', PaymentMethodEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
