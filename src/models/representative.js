const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Representative extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Representative.init({
    name: DataTypes.STRING,
    identityType: DataTypes.STRING,
    identityNumber: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    email: DataTypes.STRING,
    position: DataTypes.STRING,
    address: DataTypes.STRING,
    nationality: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Representative',
  });
  return Representative;
};
