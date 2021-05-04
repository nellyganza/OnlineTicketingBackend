import { TicketValidationSchemas } from '../../../helpers/validationSchemas';
import Util from '../../../helpers/utils';
import cardService from '../../../services/cardService';
import eventService from '../../../services/eventService';

const util = new Util();
const { newTicketAttender, newTicketBuyer } = TicketValidationSchemas;
export const newTicketValidation = async (req, res, next) => {
  const { attender, buyer } = req.body;
  const validateBuyer = async () => {
    try {
      const { error } = newTicketBuyer.validate(buyer);
      if (error) {
        const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
        util.setError(400, Error);
        util.send(res);
        return false;
      }
      return true;
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  };
  const validateAttender = async () => {
    try {
      const errors = [];
      Object.keys(attender).forEach((attend) => {
        const { error } = newTicketAttender.validate(attender[attend]);
        console.log(`in error${error}`);
        if (error) {
          const Error = error.details[0].message.replace('/', '').replace(/"/g, '');
          errors.push(Error);
        }
      });
      if (errors.length > 0) {
        console.log(`outers   ${errors}`);
        util.setError(400, errors);
        util.send(res);
        return false;
      }
      return true;
    } catch (error) {
      util.setError(500, error);
      util.send(res);
    }
  };
  const noerrorattender = await validateAttender();
  const noerrorbuyer = await validateBuyer();
  console.log(noerrorattender, noerrorbuyer);
  if (noerrorattender && noerrorbuyer) {
    next();
  }
};

export const verfiyCardNumbers = async (req, res, next) => {
  try {
    const event = await eventService.findById(req.params.eventId);
    if (!event) {
      util.setError(404, 'No Event Found');
      return util.send(res);
    }
    const { attender } = req.body;
    const error = [];
    Object.keys(attender).every(async (method) => {
      if (!attender[method].cardNumber) {
        util.setError(404, 'No card Information Found');
        return util.send(res);
      }
      const Card = await cardService.findByName({ cardNumber: attender[method].cardNumber });
      console.log(Card.length);
      if (Card.length === 0) {
        error.push(true);
      }
    });
    console.log(error);
    if (error.length !== 0) {
      util.setError(404, 'Please Check Again your Tickets Information');
      return util.send(res);
    }
    if (error.length === 0) {
      next();
    }
  } catch (error) {
    util.setError(500, error.message);
    return util.send(res);
  }
};
