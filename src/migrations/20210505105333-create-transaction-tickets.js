module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionTickets', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      transactionId: {
        type: Sequelize.UUID,
        references: {
          model: 'Transactions',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      transaction_ref: {
        type: Sequelize.STRING,
      },
      nationalId: {
        type: Sequelize.STRING,
      },
      ticketId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tickets',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TransactionTickets');
  },
};
