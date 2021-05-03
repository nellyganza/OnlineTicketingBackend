module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('Roles', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Roles', [{
      RoleId: 1,
      name: 'Super admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      RoleId: 2,
      name: 'Event Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      RoleId: 3,
      name: 'Manager',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      RoleId: 4,
      name: 'Buyer user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      RoleId: 5,
      name: 'Attender user',
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
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
