import Util from '../helpers/utils';
import guestService from '../services/guestService';
import ticketController from './ticketsController';

const util = new Util();
export default class Guest {
  static async allGuest(req, res) {
    try {
      const { eventId } = req.params;
      const guests = await guestService.getGuests(eventId);
      util.setSuccess(200, 'all  guests', guests);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all guests');
      return util.send(res);
    }
  }

  static async saveGuest(req, res) {
    try {
      const exist = await guestService.findByName({ nationalId: req.body.nationalId, eventId: req.body.eventId });
      if (exist) {
        util.setError(404, `The National ID already registered on ${exist.fullName} in this Event`);
        return util.send(res);
      }
      const createdGuest = await guestService.createGuest({ ...req.body });
      await ticketController.sendGuestBadgeEmail(createdGuest);
      util.setSuccess(200, 'Guest created', createdGuest);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findGuest(req, res) {
    try {
      const { id } = req.params;
      const singleGuest = await guestService.findById(id);
      util.setSuccess(200, 'Successfully retrieved Guest', singleGuest);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Guest was not retrieved');
      return util.send(res);
    }
  }

  static async updateGuest(req, res) {
    try {
      const { id } = req.params;
      const updatedGuest = await guestService.updateAtt({ ...req.body }, { id });
      util.setSuccess(200, 'Guest updated successfully', updatedGuest);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Guest not deleted');
      return util.send(res);
    }
  }

  static async deleteGuest(req, res) {
    try {
      const { id } = req.params;
      await guestService.deleteGuest(id);
      util.setSuccess(200, 'Guest deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Guest was not deleted');
      return util.send(res);
    }
  }

  static async getGuestsByHoster(req, res) {
    try {
      const { id } = req.userInfo;
      const {
        page, size, keyword, ...other
      } = req.query;
      const guests = await guestService.filterByHoster(id, keyword, other, page, size);
      if (!guests) {
        util.setError(404, 'Guests Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Guests Found', guests);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
