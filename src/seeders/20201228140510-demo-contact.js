module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Contacts', [{
      userId: 4,
      message: 'Hello,  Murigukora neza mutugezaho uburyo bworoshye mukwinjira mumaticket',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
