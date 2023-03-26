const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TransactionTickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.TransactionTickets.belongsTo(models.Transactions, {
        foreignKey: 'transactionId',
        onDelete: 'NO ACTION',
      });
      models.TransactionTickets.belongsTo(models.Ticket, {
        foreignKey: 'ticketId',
        onDelete: 'NO ACTION',
      });
    }
  }
  TransactionTickets.init({
    transactionId: DataTypes.UUID,
    transaction_ref: DataTypes.STRING,
    ticketId: DataTypes.UUID,
    nationalId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TransactionTickets',
  });
  return TransactionTickets;
};
