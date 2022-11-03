import models from '../models';
import MainService from './MainService';

const { Notification } = models;
/**
 * @exports
 * @class Notificationservice
 */
class Notificationervice extends MainService {
  /**
   * create new user
   * @static createNotification
   * @param {object} newNotification
   * @memberof Notificationervice
   * @returns {object} data
   */
  static createNotification(newNotification) {
    return Notification.create(newNotification);
  }

  static getNotifications(id, page, size) {
    const { limit, offset } = this.getPagination(page, size);
    return Notification.findAndCountAll(
      {
        where: { userId: id },
        order: [['createdAt', 'ASC']],
        limit,
        offset,
      },
    ).then((data) => this.getPagingData(data, page, limit))
      .catch((err) => {
        throw new Error(err.message || 'Some error occurred while retrieving Data.');
      });
  }

  static deleteAllNotification(userId) {
    return Notification.destroy({
      where: { userId },
    });
  }

  static deleteOneNotification(notId) {
    return Notification.destroy({
      where: { id: notId },
    });
  }

  static getOne(notification) {
    return Notification.findOne({
      where: notification,
    });
  }

  static update(notification) {
    return Notification.update({ isRead: true }, {
      where: notification,
    });
  }
}
export default Notificationervice;
