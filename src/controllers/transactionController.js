import Util from '../helpers/utils';
import txService from '../services/transactionService';

const util = new Util();
export default class TransactionController {
  static async getAllTransactions(req, res) {
    try {
      const transactions = await txService.getTransactions();
      util.setSuccess(200, 'Transactions Found', transactions);
      util.send(res);
    } catch (error) {
      util.setError(500, error.message || error);
      util.send(res);
    }
  }
}
