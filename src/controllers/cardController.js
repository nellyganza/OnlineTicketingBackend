import Util from '../helpers/utils';
import cardService from '../services/cardService';

const util = new Util();
export default class Card {
  static async registerCard(req, res) {
    try {
      const registerdcard = await cardService.createCard(req.body);
      if (!registerdcard) {
        util.setError(400, 'Card not Registered try again');
        util.send(res);
        return;
      }
      util.setSuccess(200, 'Card registered Success', registerdcard);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }

  static async getAllCard(req, res) {
    try {
      const data = { ...req.query };
      const info = {};
      if (data.hasOwnProperty('phoneNumber')) {
        info.phoneNumber = data.phoneNumber;
      }
      if (data.hasOwnProperty('cardNumber')) {
        info.cardNumber = data.cardNumber;
      }
      if (Object.keys(info).length === 0 && Object.keys(data).length > 0) {
        util.setError(400, 'Invalid Paramter names');
        util.send(res);
      }
      if (Object.keys(info).length === 1 && Object.keys(data).length > 1) {
        util.setError(400, 'Invalid Paramter names');
        util.send(res);
      }
      const registerdcard = await cardService.findByName(info);
      if (!registerdcard) {
        util.setError(400, 'Card(s) not Found');
        util.send(res);
        return;
      }
      util.setSuccess(200, 'Card Found Success', registerdcard);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }
}
