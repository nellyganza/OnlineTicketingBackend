const {
  Model,
} = require('sequelize');
const { ETicketStatus, ETicketCurrentStatus } = require('./enum/ETicketStatus');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Ticket.belongsTo(models.Event, {
        foreignKey: 'eventId',
        onDelete: 'NO ACTION',
      });
      models.Ticket.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'NO ACTION',
      });
      models.Ticket.belongsTo(models.EventPayment, {
        foreignKey: 'type',
      });
    }
  }
  Ticket.init({
    eventId: DataTypes.UUID,
    userId: DataTypes.UUID,
    price: DataTypes.FLOAT,
    type: DataTypes.UUID,
    paymenttype: DataTypes.STRING,
    fullName: DataTypes.STRING,
    nationalId: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    sittingPlace: DataTypes.INTEGER,
    currentSatus: {
      type: DataTypes.STRING,
      defaultValue: ETicketCurrentStatus.OUT_EVENT,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue:  ETicketStatus.NOT_ATTENDED,
    },
    cardType: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};
