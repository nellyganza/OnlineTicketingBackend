module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      transaction_ref: {
        type: Sequelize.STRING,
      },
      order_id: {
        type: Sequelize.STRING,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      eventId: {
        type: Sequelize.UUID,
        references: {
          model: 'Events',
          key: 'id',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
      },
      ticketContent: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.STRING,

      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
          onDelete: 'SET NULL',
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
    await queryInterface.dropTable('Transactions');
  },
};
