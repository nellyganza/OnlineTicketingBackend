import Flutterwave from 'flutterwave-node-v3';
import open from 'open';
import Util from '../../helpers/utils';

const util = new Util();

const flw = new Flutterwave(process.env.FRUTTER_PUBLIC_KEY, process.env.FRUTTER_SECRET_KEY);
export const rwMobileMoney = async (req, res, next) => {
  try {
    const payload = {
      tx_ref: req.body.pay.tx_ref,
      order_id: req.body.pay.order_id,
      amount: req.body.pay.amount,
      currency: 'RWF',
      email: req.body.pay.email,
      phone_number: req.body.pay.phone_number,
      fullname: req.body.pay.fullname,
    };
    const response = await flw.MobileMoney.rwanda(payload);
    console.log(response);
    const opn = await open(response.meta.authorization.redirect);
    // next();
    util.setSuccess(200, 'Success', opn);
    return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
};

export const cardPay = async (req, res, next) => {
  try {
    const payload = {
      card_number: req.body.pay.card_number,
      cvv: req.body.pay.cvv,
      expiry_month: req.body.pay.expiry_month,
      expiry_year: req.body.pay.expiry_year,

      currency: req.body.pay.currency,
      amount: req.body.pay.amount,
      redirect_url: `${process.env.HOST}/newTicket/payment/webhook`,
      fullname: req.body.pay.fullname,
      email: req.body.pay.email,
      phone_number: req.body.pay.phone_number,
      enckey: req.body.pay.enckey,
      tx_ref: req.body.pay.tx_ref, // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.

    };
    const response = await flw.Charge.card(payload);
    console.log(response);
    if (response.meta.authorization.mode === 'pin') {
      const payload2 = payload;
      payload2.authorization = {
        mode: 'pin',
        fields: [
          'pin',
        ],
        pin: 3310,
      };
      const reCallCharge = await flw.Charge.card(payload2);

      const callValidate = await flw.Charge.validate({
        otp: '12345',
        flw_ref: reCallCharge.data.flw_ref,
      });
      console.log(callValidate);
    }
    if (response.meta.authorization.mode === 'redirect') {
      const url = response.meta.authorization.redirect;
      open(url);
      util.setSuccess(200, 'Success', url);
      return util.send(res);
    }

    console.log(response);
    util.setSuccess(200, 'Success', response);
    return util.send(res);
  } catch (error) {
    util.setError(500, error);
    return util.send(res);
  }
};
