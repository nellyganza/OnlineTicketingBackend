import _ from 'lodash';
import transactionService from '../../services/transactionService';
import ticketService from '../../services/ticketService';
import transactionTicketService from '../../services/transactionTicketService';
import Util from '../../helpers/utils';
import EventService from '../../services/eventService';

const util = new Util();

export const findTickets = async (req, res, next) => {
  const userId = req.userInfo.id;
  const { pay } = req.body;
  const eventId = req.params.eventId;
  const messages = [];

  try {
    const event = await EventService.findById(eventId);
    if (!event) {
      util.setError(404, 'selected Event not Exist');
      return util.send(res);
    }
    const { attender } = req.body;

    const natIDs = [];
    _.map(attender, async (att) => {
      natIDs.push(att.nationalId);
    });
    const tickets = await ticketService.findByTicketsExists(eventId, natIDs);
    if (tickets.length > 0) {
      _.map(tickets, async (att) => {
        messages.push(`${att.fullName} with ID/Passport ${att.nationalId} already have bought ticket from event ${event.title}`);
      });

      util.setError(400, messages);
      return util.send(res);
    }
    next();
  } catch (error) {
    util.setError(404, error.message);
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
  console.log(txTService);
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
