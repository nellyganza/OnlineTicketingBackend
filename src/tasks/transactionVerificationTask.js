import cron from 'node-cron';
import { eventEmitter } from '../helpers/notifications/eventEmitter';
require('../helpers/notifications/eventListeners')

cron.schedule('*/5 * * * * *', async () => {
    eventEmitter.emit('verifyTransactionEvent');
    console.log(eventEmitter.eventNames())
})