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
      name: 'Super admin',
      description: 'Super admin',
      slug: 'super_admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Event Admin',
      description: 'Event Admin',
      slug: 'event_admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Manager',
      description: 'Manager',
      slug: 'manager',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Buyer user',
      description: 'Buyer user',
      slug: 'buyer_user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Attender user',
      description: 'Attender user',
      slug: 'attender_user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Validator user',
      description: 'Validator user',
      slug: 'validator_user',
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
