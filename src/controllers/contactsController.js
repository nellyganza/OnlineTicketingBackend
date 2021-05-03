import Util from '../helpers/utils';
import contactService from '../services/contactService';

const util = new Util();
export default class contact {
  static async allcontact(req, res) {
    try {
      const contacts = await contactService.getContacts();
      util.setSuccess(200, 'all contacts', contacts);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all contacts');
      return util.send(res);
    }
  }

  static async savecontact(req, res) {
    try {
      const { userId, message } = req.body;
      const createdcontact = await contactService.createContact({ userId, message });
      util.setSuccess(200, 'contact created', createdcontact);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findcontact(req, res) {
    try {
      const { id } = req.params;
      const singlecontact = await contactService.findById(id);
      if (!singlecontact) {
        util.setError(404, 'Contact Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Successfully retrieved contact', singlecontact);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry contact was not retrived');
      return util.send(res);
    }
  }

  static async findcontactByUserId(req, res) {
    try {
      const { userId } = req.params;

      const singlecontact = await contactService.findByName({ userId });
      util.setSuccess(200, 'Successfully retrieved contact', singlecontact);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'sorry contact was not retrieved');
      return util.send(res);
    }
  }

  static async updatecontact(req, res) {
    try {
      const { userId, message } = req.body;
      const { id } = req.params;

      const updatedcontact = await contactService.updateAtt({ userId, message }, { id });
      util.setSuccess(200, 'contact updated successfuly', updatedcontact);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry contact not deleted');
      return util.send(res);
    }
  }

  static async deletecontact(req, res) {
    try {
      const { id } = req.params;
      await contactService.deleteContact(id);
      util.setSuccess(200, 'contact deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry contact was not deleted');
      return util.send(res);
    }
  }
}
