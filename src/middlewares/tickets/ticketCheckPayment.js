import _, { at } from 'lodash';
import transactionService from '../../services/transactionService';
import ticketService from '../../services/ticketService';
import transactionTicketService from '../../services/transactionTicketService';
import Util from '../../helpers/utils';
import EventService from '../../services/eventService';
import EventSittingPlaceService from '../../services/eventSittingPlaceService';

const util = new Util();

export const findTickets = async (req, res, next) => {
  const userId = req.userInfo.id;
  const { pay, attender } = req.body;
  const eventId = req.params.eventId;
  let messages = '';

  try {
    const attansers = _.map(_.groupBy(attender, (a) => a.type), (a, i) => ({ id: Number(i), number: a.length }));

    const event = await EventService.findById(eventId);
    const EventSittingPlaces = await EventSittingPlaceService.findByName({ eventId });
    if (!event) {
      util.setError(404, 'selected Event not Exist');
      return util.send(res);
    }
    _.map(attansers, (a) => {
      const { placesLeft, name } = EventSittingPlaces.find((p) => p.id === a.id) || 0;
      if (placesLeft < a.number) {
        messages = `${messages}\n In ${name} remains ${placesLeft} Tickets and your requesting ${a.number} Tickets`;
      }
    });
    if (messages.length > 0) {
      util.setError(400, messages);
      return util.send(res);
    }

    const natIDs = [];
    _.map(attender, async (att) => {
      natIDs.push(att.nationalId);
    });
    const tickets = await ticketService.findByTicketsExists(eventId, natIDs);
    if (tickets.length > 0) {
      _.map(tickets, async (att) => {
        messages = `${messages}\n ${att.fullName} with ID/Passport ${att.nationalId} already have bought ticket from event ${event.title}`;
      });

      util.setError(400, messages);
      return util.send(res);
    }
    next();
  } catch (error) {
    console.log(error);
    util.setError(400, error.message);
    return util.send(res);
  }
};

export const checkPyament = async (req, res, next) => {
  const { nationalId } = req.body;
  const { eventId } = req.params;

  const ticket = await ticketService.findBynationalId({ nationalId, eventId, status: 'not Attended' });
  if (!ticket) {
    util.statusCode = 400;
    return util.send(res);
  }
  const { userId, id } = ticket.dataValues;
  const txTService = await transactionTicketService.findByProp({ nationalId, ticketId: id });
  if (txTService.length > 0) {
    txTService.forEach(async (txt) => {
      const { transaction_ref } = txt.dataValues;
      const transaction = await transactionService.findByTransactionRef(transaction_ref);
      const { status } = transaction.dataValues;
      if (status === 'PAYED') {
        next();
      }
    });
  } else {
    util.message = 'Invalid Card, Please Pay your ticket and Enter !!';
    util.statusCode = 400;
    return util.send(res);
  }
};
