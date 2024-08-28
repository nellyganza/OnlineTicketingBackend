import Util from '../helpers/utils';
import bankService from '../services/bankService';

const util = new Util();
export default class BankController {
  static async allBank(req, res) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const Banks = await bankService.getBanks(page, limit);
      util.setSuccess(200, 'all Banks', Banks);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all Banks');
      return util.send(res);
    }
  }

  static async saveBank(req, res) {
    try {
      const createdBank = await bankService.createBank({ ...req.body });
      util.setSuccess(200, 'Bank created', createdBank);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findBank(req, res) {
    try {
      const { id } = req.params;
      const singleBank = await bankService.findById(id);
      if (!singleBank) {
        util.setError(404, 'Bank Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Bank Found', singleBank);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateBank(req, res) {
    try {
      const { id } = req.params;
      const updatedBank = await bankService.updateAtt({ ...req.body }, { id });
      util.setSuccess(200, 'Bank updated successfully', updatedBank);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async deleteBank(req, res) {
    try {
      const { id } = req.params;
      await bankService.deleteBank(id);
      util.setSuccess(200, 'Bank deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
