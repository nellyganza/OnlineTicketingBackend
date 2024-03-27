import express from 'express';
import { propertiesToJson } from 'properties-file';
import { eventEmitter } from '../../../helpers/notifications/eventEmitter';
import Util from '../../../helpers/utils';
import { isAuthenticated } from '../../../middlewares/authorization';
import TransactionService from '../../../services/transactionService';

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
    const momoPayload = {
      tx_ref: payload.tx_ref,
      order_id: payload.order_id,
      amount: payload.amount,
      currency: payload.currency,
      email: payload.email,
      phone_number: payload.phone_number,
      fullname: payload.fullname,
    };
    console.log(momoPayload, payload);
    const result = await flw.MobileMoney.rwanda(momoPayload);
    console.log(result, 'Complete - Result');
    if (result.status === 'success') {
      await TransactionService.createTransaction({ ...payload, transactionId: payload.tx_ref });
      util.setSuccess(200, 'Mobile Money Payment Initiated', result);
      return util.send(res);
    }
    util.setError(400, 'Mobile Money Payment Failed');
    return util.send(res);
  } catch (error) {
    console.log(error);
    util.setError(400, error.message);
    return util.send(res);
  }
});

router.post('/bank-moneyaa', isAuthenticated, async (req, res) => {
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

// In an Express-like app:

// The route where we initiate payment (Steps 1 - 3)
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
    const userPayload = data.payload;
    const tx_ref = userPayload && userPayload.tx_ref ? userPayload.tx_ref : generateTransactionReference('TX');
    const authorization = data.authorization;

    let payload = {
      card_number,
      cvv,
      expiry_month,
      expiry_year,
      currency,
      amount,
      email,
      fullname,
      // Generate a unique transaction reference
      tx_ref,
      redirect_url: `${process.env.APP_BASE_URL}/pay/redirect`,
      enckey: process.env.FRUTTER_ENCRIP_KEY,
    };

    if (authorization) {
      payload = {
        ...payload, authorization,
      };
    }
    const response = await flw.Charge.card(payload);

    if (response.status === 'error') {
      util.setError(400, response.message);
      return util.send(res);
    }

    switch (response?.meta?.authorization?.mode) {
      case 'pin':
      case 'avs_noauth':
        const respData = {
          charge_payload: payload,
          auth_mode: response.meta.authorization.mode,
          eventId,
          redirect: '/pay/authorize',
        };
        util.setSuccess(200, 'Please enter your pin', { ...respData });
        return util.send(res);
      case 'otp':
        try {
          await TransactionService.createTransaction({
            ...data, tx_ref, order_id: generateTransactionReference('OD'), userId: req.userInfo.id, eventId, transactionId: response.data.id,
          });
          util.setSuccess(200, response.data.processor_response, {
            action: 'otp', flw_ref: response.data.flw_ref, transactionId: response.data.id, tx_ref: response.data.tx_ref,
          });
          return util.send(res);
        } catch (error) {
          util.setError(400, error.message);
          return util.send(res);
        }
      case 'redirect':
      // Store the transaction ID
      // so we can look it up later with the flw_ref
        const payloadData = {
          ...data, tx_ref, order_id: generateTransactionReference('OD'), userId: req.userInfo.id, eventId, transactionId: response.data.id,
        };
        await TransactionService.createTransaction(payloadData);
        // Auth type is redirect,
        // so just redirect to the customer's bank
        const authUrl = response.meta.authorization.redirect;
        util.setSuccess(200, 'Confirm payment by your bank', { redirect: authUrl });
        return util.send(res);
      default:
      // No authorization needed; just verify the payment
        const transactionId = response.data.id;
        const transaction = await flw.Transaction.verify({
          id: transactionId,
        });
        if (transaction.data.status === 'successful') {
          util.setSuccess(200, 'Payment successful', transaction);
          return util.send(res);
        } if (transaction.data.status === 'pending') {
        // Schedule a job that polls for the status of the payment every 10 minutes
        // transactionVerificationQueue.add({
        //   id: transactionId,
        // });
          return util.send(res, { redirect: '/payment-processing' });
        }
        util.setError(400, 'Payment Failed', transaction);
        return util.send(res);
    }
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
});

// // The route where we send the user's auth details (Step 4)
// router.post('/pay/authorize', async (req, res) => {
//   const payload = req.session.charge_payload;
//   console.log('payloadAuthriza', payload);
//   // Add the auth mode and requested fields to the payload,
//   // then call chargeCard again
//   payload.authorization = {
//     mode: req.session.auth_mode,
//   };
//   req.session.auth_fields.forEach((field) => {
//     payload.authorization.field = req.body[field];
//   });
//   const response = await flw.Charge.card(payload);

//   switch (response?.meta?.authorization?.mode) {
//     case 'otp':
//       // Show the user a form to enter the OTP
//       req.session.flw_ref = response.data.flw_ref;
//       return res.redirect('/pay/validate');
//     case 'redirect':
//       const payloadData = {
//         ...data, tx_ref, order_id: generateTransactionReference('OD'), userId: req.userInfo.id, eventId, transactionId: response.data.id,
//       };
//       await TransactionService.createTransaction(payloadData);
//       const authUrl = response.meta.authorization.redirect;
//       return res.redirect(authUrl);
//     default:
//       // No validation needed; just verify the payment
//       const transactionId = response.data.id;
//       const transaction = await flw.Transaction.verify({
//         id: transactionId,
//       });
//       if (transaction.data.status === 'successful') {
//         return res.redirect('/payment-successful');
//       } if (transaction.data.status === 'pending') {
//         // Schedule a job that polls for the status of the payment every 10 minutes
//         // transactionVerificationQueue.add({
//         //   id: transactionId,
//         // });
//         return res.redirect('/payment-processing');
//       }
//       return res.redirect('/payment-failed');
//   }
// });

// The route where we validate and verify the payment (Steps 5 - 6)
router.post('/pay/validate', async (req, res) => {
  const response = await flw.Charge.validate({
    otp: req.body.otp,
    flw_ref: req.body.flw_ref,
  });
  if (response.status === 'success' || response.status === 'pending') {
    // Verify the payment
    const transactionId = response.data.id;
    const transaction = await flw.Transaction.verify({
      id: transactionId,
    });
    if (transaction.status === 'success') {
      eventEmitter.emit('confirmTicketAfterPayment', { data: { tx_ref: req.body.tx_ref } });
      util.setSuccess(200, 'Payment successful', { transaction, action: 'completed' });
      return util.send(res);
    } if (transaction.status === 'pending') {
      // Schedule a job that polls for the status of the payment every 10 minutes
      // transactionVerificationQueue.add({
      //   id: transactionId,
      // });
      util.setSuccess(200, 'Payment pending', transaction);
      return util.send(res);
    }
  }
  util.setError(400, 'Payment Failed', response);
  return util.send(res);
});

// Our redirect_url. For 3DS payments, Flutterwave will redirect here after authorization,
// and we can verify the payment (Step 6)
router.post('/pay/redirect', async (req, res) => {
  if (req.query.status === 'successful' || req.query.status === 'pending') {
    // Verify the payment
    const txRef = req.query.tx_ref;
    const foundTransaction = await TransactionService.findByTransactionRef(txRef);
    const transactionId = foundTransaction.dataValues.transactionId;
    const transaction = flw.Transaction.verify({
      id: transactionId,
    });
    if (transaction.data.status === 'successful') {
      eventEmitter.emit('confirmTicketAfterPayment', { data: { tx_ref: txRef } });
      util.setSuccess(200, 'Payment successful', { transaction, action: 'completed' });
      return util.send(res);
    } if (transaction.data.status === 'pending') {
      // Schedule a job that polls for the status of the payment every 10 minutes
      // transactionVerificationQueue.add({
      //   id: transactionId,
      // });
      return res.redirect('/payment-processing');
    }
  }

  return res.redirect('/payment-failed');
});

export default router;
