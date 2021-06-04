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
      managerId: {
        type: Sequelize.INTEGER,
      },
      dateAndTimme: {
        type: Sequelize.DATE,
      },
      place: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
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
