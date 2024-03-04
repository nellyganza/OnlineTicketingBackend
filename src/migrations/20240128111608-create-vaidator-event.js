/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VaidatorEvents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      eventPaymentId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'EventPayments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: Sequelize.BOOLEAN,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }, {
      uniqueKeys: {
        Tickets_unique: {
          fields: ['userId', 'eventPaymentId'],
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VaidatorEvents');
  },
};
