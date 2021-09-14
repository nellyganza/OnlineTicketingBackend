const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Event.hasMany(models.EventPayment, {
        foreignKey: 'eventId',
      });
      models.Event.hasMany(models.EventSittingPlace, {
        foreignKey: 'eventId',
      });
      models.Event.hasMany(models.PaymentMethod, {
        foreignKey: 'eventId',
      });
      models.Event.hasMany(models.Ticket, {
        foreignKey: 'eventId',
      });
      models.Event.hasMany(models.Comment, {
        foreignKey: 'eventId',
      });
      models.Event.hasMany(models.Transactions, {
        foreignKey: 'event',
      });
      models.Event.belongsTo(models.Users, {
        foreignKey: 'userId',
      });
    }
  }
  Event.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    host: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    dateAndTimme: DataTypes.DATE,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    duration: DataTypes.DOUBLE,
    place: DataTypes.STRING,
    country: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    numberofTicket: {
      type: DataTypes.INTEGER,
    },
    numberboughtticket: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    ticketLeft: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending',
    },
    share: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    placeImage: {
      type: DataTypes.BLOB('long'),
    },
    eventType: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
