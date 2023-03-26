const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Guest.belongsTo(models.Event, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
      });
      models.Guest.belongsTo(models.EventPayment, {
        foreignKey: 'type',
      });
    }
  }
  Guest.init({
    eventId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.UUID, allowNull: false },
    fullName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    nationalId: { type: DataTypes.STRING, allowNull: false },
    organization: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING },
  }, {
    sequelize,
    modelName: 'Guest',
  });
  return Guest;
};
