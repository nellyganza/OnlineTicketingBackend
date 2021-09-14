import notificationService from '../services/notifications';
import Util from '../helpers/utils';

const util = new Util();

export default class notifier {
  static async notifyTheUser(notification) {
    try {
      await notificationService.createNotification(notification);
    } catch (error) {
      console.log(error);
    }
  }

  static async markRead(req, res) {
    try {
      const id = req.params.id;
      const data = await notificationService.update({ id });
      util.setSuccess(200, 'Updated', data);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async showAll(req, res) {
    try {
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const { id } = req.userInfo;

      const notifications = await notificationService.getNotifications(id);
      const result = {};
      result.number = notifications.length;
      result.result = notifications.slice(page, page + limit);
      util.setSuccess(200, 'all Notifications', result);
      return util.send(res);
    } catch (error) {
      console.log(error);
      util.setError(500, 'Unable to retrieve all notifications');
      return util.send(res);
    }
  }

  static async deleteOne(req, res) {
    try {
      const notId = req.params.notId;
      const notifications = await notificationService.deleteOneNotification(notId);
      util.setSuccess(200, 'Notification Deleted', notifications);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }

  static async deletAll(req, res) {
    try {
      const { id } = req.userInfo;
      const notifications = await notificationService.deleteAllNotification(id);
      util.setSuccess(200, 'Notifications Deleted', notifications);
      return util.send(res);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(res);
    }
  }
}
