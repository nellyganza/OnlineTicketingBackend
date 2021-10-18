import Util from '../helpers/utils';
import clientsService from '../services/clientService';
import { cloudinaryUploader } from '../helpers/cloudinaryUploader';

const fs = require('fs');

const util = new Util();
export default class contact {
  static async registerClient(req, res) {
    try {
      const url = await cloudinaryUploader(req.files[0].path);
      const savedclient = await clientsService.createClients({ title: req.body.title, image: url });
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
      const deleted = await clientsService.deleteClients(id);
      util.setSuccess(200, 'Client Deleted', deleted);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
