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

app.use(cors({ origin: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use('/', (req, res) => {
  res.send('Welcome to Online Ticketing System .......\n  Owner : Intercore LTD');
});
app.use('/api-documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);
app.get('/stripe-key', (req, res) => {
  res.send({ publishableKey: process.env.STRIP_PUB_KEY });
});

export default app;
