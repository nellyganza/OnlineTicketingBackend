const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VaidatorEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.VaidatorEvent.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'NO ACTION',
      });
      models.VaidatorEvent.belongsTo(models.EventPayment, {
        foreignKey: 'eventPaymentId',
        onDelete: 'NO ACTION',
      });
    }
  }
  VaidatorEvent.init({
    userId: DataTypes.UUID,
    eventPaymentId: DataTypes.UUID,
    status: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'VaidatorEvent',
  });
  return VaidatorEvent;
};
