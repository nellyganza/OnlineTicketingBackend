import Util from '../helpers/utils';
import accountService from '../services/accountService';

const util = new Util();
export default class AccountController {
  static async allAccount(req, res) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const Accounts = await accountService.getAccounts(page, limit);
      util.setSuccess(200, 'all Accounts', Accounts);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Unable to retrieve all Accounts');
      return util.send(res);
    }
  }

  static async saveAccount(req, res) {
    try {
      const createdAccount = await accountService.createAccount({ ...req.body });
      util.setSuccess(200, 'Account created', createdAccount);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async findAccount(req, res) {
    try {
      const { id } = req.params;
      const singleAccount = await accountService.findById(id);
      if (!singleAccount) {
        util.setError(404, 'Account Not Found');
        return util.send(res);
      }
      util.setSuccess(200, 'Account Found', singleAccount);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async updateAccount(req, res) {
    try {
      const { id } = req.params;
      const updatedAccount = await accountService.updateAtt({ ...req.body }, id);
      util.setSuccess(200, 'Account updated successfuly', updatedAccount);
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Account not updated');
      return util.send(res);
    }
  }

  static async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      await accountService.deleteAccount(id);
      util.setSuccess(200, 'Account deleted successfully');
      return util.send(res);
    } catch (error) {
      util.setError(500, 'Sorry Account was not deleted');
      return util.send(res);
    }
  }
}
