const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventPayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.EventPayment.belongsTo(models.Event, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
      });
      models.EventPayment.hasMany(models.VaidatorEvent, {
        foreignKey: 'eventPaymentId',
      });
    }
  }
  EventPayment.init({
    eventId: DataTypes.UUID,
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    boughtTickets: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalNumberTicket: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'EventPayment',
  });
  return EventPayment;
};
