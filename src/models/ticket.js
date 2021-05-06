const {
  Model,
} = require('sequelize');

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
        onDelete: 'NO ACTION'
      });
      models.Ticket.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'NO ACTION'
      });
      models.Ticket.hasMany(models.TransactionTickets,{
        foreignKey: 'ticketId',
        onDelete: 'NO ACTION'
      })
    }
  }
  Ticket.init({
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    type: DataTypes.INTEGER,
    paymenttype: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    cardNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    sittingPlace: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'not Attended',
    },
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};
