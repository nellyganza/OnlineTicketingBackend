module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      host: {
        type: Sequelize.STRING,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      dateAndTimme: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.STRING,
      },
      endDate: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.DOUBLE,
      },
      place: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      image: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      placeImage: {
        type: Sequelize.TEXT,
      },
      numberofTicket: {
        type: Sequelize.INTEGER,
      },
      numberboughtticket: {
        type: Sequelize.INTEGER,
      },
      ticketLeft: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      share: {
        type: Sequelize.BOOLEAN,
      },
      eventType: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('Events');
  },
};
