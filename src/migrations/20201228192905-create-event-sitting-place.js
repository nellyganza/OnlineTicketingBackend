module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventSittingPlaces', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      eventId: {
        type: Sequelize.UUID,
        references: {
          model: 'Events',
          key: 'id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      },
      name: {
        type: Sequelize.STRING,
      },
      totalPlaces: {
        type: Sequelize.INTEGER,
      },
      numberOfpeople: {
        type: Sequelize.INTEGER,
      },
      placesLeft: {
        type: Sequelize.INTEGER,
      },
      placeAvailable: {
        type: Sequelize.ARRAY(Sequelize.RANGE(Sequelize.INTEGER)),
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
    await queryInterface.dropTable('EventSittingPlaces');
  },
};
