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
    accNumber: {
      type: DataTypes.STRING,
    },
    accName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    flutterId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PaymentMethod',
  });
  return PaymentMethod;
};
