const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Bank.hasMany(models.Account, {
        foreignKey: 'bank',
      });
    }
  }
  Bank.init({
    name: DataTypes.STRING,
    transferCode: DataTypes.STRING,
    transferCodeType: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Bank',
  });
  return Bank;
};
