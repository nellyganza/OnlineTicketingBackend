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
    next();
    // util.setSuccess(200, 'Success', opn);
    // return util.send(res);
  } catch (error) {
    util.setError(400, error.message);
    return util.send(res);
  }
};

export const cardPay = async (req, res, next) => {
  try {
    const payload = {
      card_number: '5531 8866 5214 2950',
      cvv: '564',
      expiry_month: '09',
      expiry_year: '32',
      currency: 'RWF',
      amount: '1000',
      redirect_url: 'http://localhost:5000/newTicket/payment/webhook',
      fullname: 'Nishimwe Elysee',
      email: 'nishimwelys@gmail.com',
      phone_number: '0780781546',
      enckey: '611d0eda25a3c931863d92c4',
      tx_ref: 'MC-32444ee--4eerye4euee3rerds4423e43e', // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.

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
    }

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
