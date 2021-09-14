import cron from 'node-cron';
import { eventEmitter } from '../helpers/notifications/eventEmitter';

require('../helpers/notifications/eventListeners');

cron.schedule('* * * * *', async () => {
  eventEmitter.emit('completeEvent');
});
