import models from '../models';

const { Notification } = models;
/**
 * @exports
 * @class Notificationservice
 */
class Notificationervice {
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

  static getNotifications(id) {
    return Notification.findAll(
      {
        where: { userId: id },
        order: [['createdAt', 'ASC']],
      },
    );
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
