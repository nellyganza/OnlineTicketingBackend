import eventStittingPlaceService from '../services/eventSittingPlaceService';
import Util from '../helpers/utils';

const util = new Util();
export default class eventSittingController {
  static async createSittinPlaces(req, res) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const sittiEvents = await eventStittingPlaceService.createEventSittingPlace({ ...req.body });
      if (!sittiEvents) {
        util.setError(404, 'Events Sitting Not Created');
        return util.send(res);
      }
      util.setSuccess(201, 'Events Sitting Created', sittiEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getAllSittinPlaces(req, res) {
    try {
      const { eventId } = req.params;
      if (!eventId) {
        util.setError(400, 'Invalid Event Id');
        return util.send(res);
      }
      const sittiEvents = await eventStittingPlaceService.findByName({ eventId });
      if (!sittiEvents) {
        util.setError(404, 'Events Sitting Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Sitting Found', sittiEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateSittingPlace(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        util.setError(400, 'Invalid Place Id');
        return util.send(res);
      }
      const sittiEvents = await eventStittingPlaceService.updateAtt({ ...req.body }, { id });
      if (!sittiEvents) {
        util.setError(404, 'Event Sitting Not Updated');
        return util.send(res);
      }
      util.setSuccess(200, 'Event Sitting Update', sittiEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async deleteSittingPlace(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        util.setError(400, 'Invalid Sitting Id');
        return util.send(res);
      }
      const sittiEvents = await eventStittingPlaceService.deleteEventSittingPlace({ id });
      if (!sittiEvents) {
        util.setError(404, 'Events Sitting Not Deleted');
        return util.send(res);
      }
      util.setSuccess(200, 'Events Sitting Deleted', sittiEvents);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
