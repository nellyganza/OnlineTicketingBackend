import transactionService from '../../services/transactionService';
import ticketService from '../../services/ticketService';
import transactionTicketService from '../../services/transactionTicketService';
import Util from '../../helpers/utils';

const util = new Util();

export const checkPyament = async (req, res, next) => {
  const { cardNumber } = req.body;
  const { eventId } = req.params;

  const ticket = await ticketService.findByCardNumber({ cardNumber, eventId, status: 'not Attended' });
  if (!ticket) {
    util.message = 'This card was used Before in this Event !!';
    util.statusCode = 400;
    return util.send(res);
  }
  const { userId, id } = ticket.dataValues;
  const txTService = await transactionTicketService.findByProp({ cardNumber, ticketId: id });
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
