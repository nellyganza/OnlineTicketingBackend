import express from 'express';
import open from 'open';
import { propertiesToJson } from 'properties-file';
import Util from '../../../helpers/utils';
import TransactionService from '../../../services/transactionService';
import { allowedRoles, isAuthenticated } from '../../../middlewares/authorization';
import { eventEmitter } from '../../../helpers/notifications/eventEmitter';

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
      if (!bank) {
        const data = propertiesToJson(`${process.env.PROPERTY_LOCATION}eticket.properties`);
        const pd = {
          id: data.id,
        };
        const reesp = await flw.Subaccount.fetch(pd);
        util.setSuccess(200, 'Found Bank ', reesp.data);
        return util.send(res);
      }
      payload.id = bank.id;
      const resp = await flw.Subaccount.update(payload);
      util.setSuccess(200, 'Found Bank ', resp.data);
      return util.send(res);
    }
    util.setSuccess(200, 'Account created', response.data);
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
});
router.get('/banks', async (req, res) => {
  try {
    const payload = {
      country: 'RW',
    };
    const response = await flw.Bank.country(payload);
    if (response.status === 'success') {
      util.setSuccess(200, response.message, response.data);
    } else {
      util.setError(400, response.message);
    }
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
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
    return util.send(res);
  }
});

const generateTransactionReference = (sufix) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 10; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return sufix + text;
};

// make mobile money payment
router.post('/mobile-money', isAuthenticated, async (req, res) => {
  try {
    const data = { ...req.body };
    const { eventId } = req.query;
    const payload = {
      ...data, tx_ref: generateTransactionReference('TX'), order_id: generateTransactionReference('OD'), userId: req.userInfo.id, eventId, subaccount: data.eventPaymentMethods,
    };
    const result = await flw.MobileMoney.rwanda(payload);
    await TransactionService.createTransaction(payload);
    open(result.meta.authorization.redirect);
    util.setSuccess(200, 'Mobile Money Payment', result);
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
});

router.post('/bank-money', isAuthenticated, async (req, res) => {
  try {
    const data = { ...req.body };
    const { eventId } = req.query;
    const { card } = data;
    // "card_number":"5531886652142950",
    // "cvv":"564",
    // "expiry_month":"09",
    // "expiry_year":"32",
    // "currency":"NGN",
    // "amount":"100",
    // "fullname":"Yolande Aglaé Colbert",
    // "email":"user@example.com",
    // "tx_ref":"MC-3243e",
    // "redirect_url":"https://www,flutterwave.ng"

    const card_number = card.cardNumber;
    const cvv = card.cvv;
    const expiry_month = card.exprationDate.split('-')[1];
    const expiry_year = card.exprationDate.split('-')[0];
    const currency = 'RWF';
    const amount = data.amount;
    const fullname = card.holderName;
    const email = data.email;
    const tx_ref = generateTransactionReference('TX');
    const redirect_url = 'https://8a88-154-73-161-230.ngrok.io/api/v1/flutterwave/mobile-money/redirect';
    const payload = {
      card_number,
      cvv,
      expiry_month,
      expiry_year,
      currency,
      amount,
      fullname,
      email,
      tx_ref,
      redirect_url,
      enckey: process.env.FRUTTER_ENCRIP_KEY,
      authorization: {
        mode: 'pin',
        pin: '3310',
      },
    };

    const result = await flw.Charge.card(payload);
    const payloadData = {
      ...data, tx_ref, order_id: generateTransactionReference('OD'), userId: req.userInfo.id, eventId,
    };
    await TransactionService.createTransaction(payloadData);
    if (result.status === 200) {
      util.setSuccess(200, 'Bank Money Payment', result);
      return util.send(res);
    }
    util.setError(400, 'Payment Failed', result);
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
});

// webhook for mobile money payment
router.post('/mobile-money/redirect', async (req, res) => {
  try {
    const data = { ...req.body };
    eventEmitter.emit('confirmTicketAfterPayment', data);
    util.setSuccess(200, 'Mobile Money Payment', data);
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    util.send(res);
  }
});

export default router;
