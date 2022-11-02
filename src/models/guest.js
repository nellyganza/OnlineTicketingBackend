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
    }
  }
  Guest.init({
    eventId: DataTypes.INTEGER,
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    nationalId: DataTypes.STRING,
    organization: DataTypes.STRING,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Guest',
  });
  return Guest;
};
