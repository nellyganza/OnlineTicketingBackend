module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EventSittingPlaces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      eventId: {
        type: Sequelize.INTEGER,
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
