import _ from 'lodash';
import ticketService from '../services/ticketService';
import userservice from '../services/userService';
import eventservice from '../services/eventService';
import transactionService from '../services/transactionService';
import transactionTicketService from '../services/transactionTicketService';
import Util from '../helpers/utils';
import {
  updatePaymentGrade, updateSittingPlace, updateEvent, getAndUpdateSittingPlace,
} from '../helpers/ControllerFunctions';
import { eventEmitter } from '../helpers/notifications/eventEmitter';

const util = new Util();

export default class ticketController {
  static async saveTicket(req, res) {
    const userId = req.userInfo.id;
    const { pay } = req.body;
    const eventId = req.params.eventId;
    const messages = [];

    const transaction = {
      transaction_ref: pay.tx_ref,
      order_id: pay.order_id,
      event: eventId,
      user: userId,
    };
    try {
      // const savedTransacrion = await transactionService.createTransaction(transaction);

      const { attender } = req.body;

      const event = await eventservice.findById(eventId);
      if (!event) {
        util.setError(404, 'selected Event not Exist');
        return util.send(res);
      }
      const i = 0;
      _.map(attender, async (att) => {
        const ticket = await ticketService.findBynationalId({ eventId, nationalId: att.nationalId });
        if (!ticket) {
          const sittingPlace = await getAndUpdateSittingPlace(eventId, att.type, 'updatePlaces') - 1;
          const savedTicket = await ticketService.createTicket({
            ...att, eventId, userId, paymenttype: pay.paymenttype, sittingPlace,
          });
          const { id, nationalId } = savedTicket.dataValues;
          eventEmitter.emit('SendSucessfullPaymentNotification', id, { nationalId, names: att.fullName });
          await updateEvent(eventId);
          await updatePaymentGrade(att.type);
          await updateSittingPlace(eventId, att.type);

          messages.push(`Ticket of ${att.fullName} from event ${event.title} saved`);
        } else {
          messages.push(`${att.fullName} already have bought ticket from event ${event.title}`);
        }
      });
      // Object.keys(attender).forEach(async (method) => {
      //   const ticket = await ticketService.findBynationalId({ eventId, nationalId: attender[method].nationalId });
      //   if (!ticket) {
      //     i++;
      //     const savedTicket = await ticketService.createTicket({
      //       ...attender[method], eventId, userId, paymenttype: pay.paymenttype,
      //     });
      //     const { transaction_ref } = savedTransacrion.dataValues;
      //     const transactionId = savedTransacrion.dataValues.id;
      //     const { id, nationalId } = savedTicket.dataValues;
      //     await transactionTicketService.createTransactionTicket({
      //       transactionId, transaction_ref, ticketId: id, nationalId,
      //     });
      //     eventEmitter.emit('SendSucessfullPaymentNotification', id);
      //     updateEvent(eventId);
      //     updateSittingPlace(eventId, attender[method].type);
      //     updatePaymentGrade(attender[method].type);
      //     await getAndUpdateSittingPlace(eventId, attender[method].type, 'updatePlaces');
      //     messages.push(`Ticket of ${attender[method].fullName} from event ${event.title} saved`);
      //   } else {
      //     messages.push(`${attender[method].fullName} already have bought ticket from event ${event.title}`);
      //   }
      // });
      util.setSuccess(200, messages);
      util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async getTicketByEvent(req, res) {
    const eventId = req.params.eventId;
    try {
      const foundTickets = await ticketService.findByName({ eventId });
      util.setSuccess(200, 'Tickets Found', { ...foundTickets });
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async getTicketByEventAndUser(req, res) {
    const eventId = req.params.eventId;
    const userId = req.userInfo.id;
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = (page * limit);
      const result = {};
      result.next = {
        page: page + 1,
        limit,
      };
      if (startIndex > 0) {
        result.prev = {
          page: page - 1,
          limit,
        };
      }
      const FoundTickets = await ticketService.findByName({ eventId, userId });
      result.result = FoundTickets.slice(startIndex, endIndex);
      util.setSuccess(200, 'Tickets Found', result);
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async getTicketByUser(req, res) {
    const userId = req.userInfo.id;
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const startIndex = (page - 1) * limit;
      const endIndex = (page * limit);
      const result = {};
      result.next = {
        page: page + 1,
        limit,
      };
      if (startIndex > 0) {
        result.prev = {
          page: page - 1,
          limit,
        };
      }
      const FoundTickets = await ticketService.findByName({ userId });
      result.result = FoundTickets.slice(startIndex, endIndex);
      util.setSuccess(200, 'Tickets Found', result);
      return util.send(res);
    } catch (error) {
      util.setError(404, error.message);
      return util.send(res);
    }
  }

  static async entrance(req, res) {
    const { eventId } = req.params;
    const { nationalId } = req.body;
    const sittingType = req.body.sittingType ? req.body.sittingType : null;
    if (!nationalId) {
      util.setError(400, 'No National ID found in request');
      return util.send(res);
    }
    let ticket;
    if (!sittingType) ticket = await ticketService.findBynationalId({ eventId, nationalId });
    else ticket = await ticketService.findBynationalId({ eventId, nationalId, type: sittingType });
    if (ticket) {
      if (ticket.status === 'not Attended') {
        const updatedticket = await ticketService.updateAtt({ status: 'Attended', currentStatus: 'IN' }, { id: ticket.id });
        if (!updatedticket) {
          util.setError(400, 'Please Try again');
          return util.send(res);
        }
        util.setSuccess(200, 'You are verified, Please Enter', updatedticket);
        return util.send(res);
      }
      if (ticket.currentStatus === 'IN') {
        const outTicket = await ticketService.updateAtt({ currentStatus: 'OUT' }, { id: ticket.id });
        if (!outTicket) {
          util.setError(400, 'Please Try again');
          return util.send(res);
        }
        util.setSuccess(200, 'Your are in now', outTicket);
        return util.send(res);
      }

      const inTicket = await ticketService.updateAtt({ currentStatus: 'IN' }, { id: ticket.id });
      if (!inTicket) {
        util.setError(400, 'Please Try again');
        return util.send(res);
      }
      util.setSuccess(200, 'Your are out now', inTicket);
      return util.send(res);
    }
    util.setError(400, 'Please, If you know that you have bought the ticket,Check the Tapping Device if match with your Ticket or Contact the Administrators');
    return util.send(res);
  }

  static async paymentVerificationWebhook(request, response) {
    const hash = request.headers['verif-hash'];

    if (!hash) {
      // discard the request,only a post with the right Flutterwave signature header gets our attention
    }
    const secret_hash = process.env.MY_HASH;
    if (hash !== secret_hash) {
      // silently exit, or check that you are passing the right hash on your server.
    }
    const request_json = JSON.parse(request.body);
    console.log(request_json);
    return response.send(200);
  }

  static async returnValidated(req, res) {
    util.setSuccess(200, 'Ticket Validated');
    return util.send(res);
  }
}
