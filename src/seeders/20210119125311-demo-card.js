module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('Cards', [{
      cardNumber: '1234-5432-3454-5432',
      fullName: 'Ishimwe Jean',
      phoneNumber: '0788765654',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      cardNumber: '5432-0987-4533-1236',
      fullName: 'Gisa Jimmy',
      phoneNumber: '07898787645',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      cardNumber: '0000-0000-0000-0000',
      fullName: 'Nishimwe Ganza Elysee',
      phoneNumber: '0780781546',
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
