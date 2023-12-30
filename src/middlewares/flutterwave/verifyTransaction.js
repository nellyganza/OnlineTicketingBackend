// unirest is an http request library so any other preferred library can be used.
import Util from '../../helpers/utils';

const unirest = require('unirest');

const util = new Util();

export const verifytx = async (req, res, next) => {
  const payload = {
    SECKEY: process.env.FRUTTER_SECRET_KEY,
    txref: req.body.pay.tx_ref,
  };
  const server_url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/verify';
  unirest.post(server_url)
    .headers({ 'Content-Type': 'application/json' })
    .send(payload)
    .end((response) => {
      if (response.body.data.status === 'successful' && response.body.data.chargecode === '00') {
        if (response.body.data.amount >= req.body.pay.amount) {
          next();
        } else {
          util.setError(400, 'You have paid less money');
          return util.send(res);
        }
      } else {
        util.setError(400, 'Payment Failed');
        return util.send(res);
      }
    }, (error) => {
      util.setError(500, error.message);
      return util.send(res);
    });
};
