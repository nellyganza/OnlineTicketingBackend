/* eslint-disable import/no-unresolved */
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import './config/passportSetup';
import cors from 'cors';
import swaggerDocument from './swagger/index';
import router from './routes';

require('./tasks/transactionVerificationTask');

const app = express();

const winston = require('winston'); // data logger
const expressWinston = require('express-winston');
// required to create middleware that log http requests
expressWinston.requestWhitelist.push('body');

app.use(cors({ origin: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true,
    }),
    new winston.transports.File({
      filename: 'ticketinfo.log',
      level: 'info',
    }),
  ],
}));
app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);
// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'ticketerror.log',
      level: 'error',
    }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
}));

app.post('/webhook-url', (req, res) => {
  /* It is a good idea to log all events received. Add code *
   * here to log the signature and body to db or file       */

  // retrieve the signature from the header
  const hash = req.headers['verif-hash'];

  if (!hash) {
    // discard the request,only a post with rave signature header gets our attention
    res.send({
      status: 'error',
    });
    process.exit(0);
    // console.log("no hash sent");
  }

  // Get signature stored as env variable on your server
  const secret_hash = process.env.MY_HASH;

  // check if signatures match

  if (hash !== secret_hash) {
    // silently exit, or check that you are passing the write hash on your server.
    res.send({
      status: 'error',
    });
    process.exit(0);
    // console.log("has is not equal sent");
  }

  // Retrieve the request's body
  const request_json = req.body;

  // Give value to your customer but don't give any output
  // Remember that this is a call from rave's servers and
  // Your customer is not seeing the response here at all

  res.send(200);
});

export default app;
