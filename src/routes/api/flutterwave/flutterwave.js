import express from 'express';
import Util from '../../../helpers/utils';

const Flutterwave = require('flutterwave-node-v3');

const flw = new Flutterwave(process.env.FRUTTER_PUBLIC_KEY, process.env.FRUTTER_SECRET_KEY);
const router = express.Router();
const util = new Util();
router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body };

    const response = await flw.Subaccount.create(payload);
    if (response.status === 'error') {
      const banks = await flw.Subaccount.fetch_all();
      const bank = banks.data.find((b) => b.account_number === payload.account_number);
      util.setSuccess(200, 'Found Bank ', bank);
      return util.send(res);
    }
    util.setSuccess(200, 'Account created', response.data);
    util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    util.send(res);
  }
});
router.get('/banks', async (req, res) => {
  try {
    const payload = {
      country: 'RW',
    };
    const response = await flw.Bank.country(payload);
    util.setSuccess(200, 'Bank Found', response);
    util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    util.send(res);
  }
});

router.get('/transaction/:amount', async (req, res) => {
  try {
    const payload = {
      amount: req.params.amount,
      currency: 'RWF',
    };
    const response = await flw.Transaction.fee(payload);
    util.setSuccess(200, 'Fees Calculated', response);
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    util.send(res);
  }
});
export default router;
