import model from '../models';
const { TransactionTickets } = model;


class transactionTicketService {
    static createTransactionTicket(newTransactionTicket) {
        return TransactionTickets.create(newTransactionTicket)
    }
    static findByProp(prop) {
        return TransactionTickets.findAll({
            where: prop,
        });
    }
}

export default transactionTicketService;