'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.Transaction.belongsTo(models.Users, {
      //   foreignKey: 'user',
      //   onDelete: 'CASCADE',
      // });
    }
  };
  Transactions.init({
    transaction_ref: DataTypes.STRING,
    order_id: DataTypes.STRING,
    event: DataTypes.INTEGER,
    ticket: DataTypes.INTEGER,
    user: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING"
    }
  }, {
    sequelize,
    modelName: 'Transactions',
  });
  return Transactions;
};