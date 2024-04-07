const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Account.belongsTo(models.Bank, {
        foreignKey: 'bank',
      });
    }
  }
  Account.init({
    name: DataTypes.STRING,
    number: DataTypes.STRING,
    currency: DataTypes.STRING,
    bank: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};