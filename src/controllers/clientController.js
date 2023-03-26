import Util from '../helpers/utils';
import { deleteFileById, getFileByFileName, getFileByFileNameAndDelete } from '../middlewares/mongo/upload';
import clientsService from '../services/clientService';

const util = new Util();
export default class Client {
  static async registerClient(req, res) {
    try {
      const savedclient = await clientsService.createClients({ title: req.body.title, image: req.files && req.files[0] ? req.files[0].filename : '' });
      util.setSuccess(200, 'Client Saved', savedclient);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async getClients(req, res) {
    try {
      const clients = await clientsService.getClientss();
      util.setSuccess(200, 'Client Found', clients);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async deleteclient(req, res) {
    try {
      const id = req.params.id;
      const client = await clientsService.findById(id);
      getFileByFileNameAndDelete(client.dataValues.image);
      const deleted = await clientsService.deleteClients(id);
      util.setSuccess(200, 'Client Deleted', deleted);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
