const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.PaymentMethod.belongsTo(models.Event, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
      });
    }
  }
  PaymentMethod.init({
    eventId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    value: DataTypes.STRING,
    paymentMade: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'PaymentMethod',
  });
  return PaymentMethod;
};
