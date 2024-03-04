module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      RoleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      profilePicture: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
        defaultValue: 'Individual',
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Attendee',
      },
      campanyName: {
        type: Sequelize.STRING,
      },
      document: {
        type: Sequelize.STRING,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
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
      socialId: {
        type: Sequelize.STRING,
      },
      provider: {
        type: Sequelize.STRING,
      },
      authToken: {
        type: Sequelize.TEXT,
      },
      share: {
        type: Sequelize.INTEGER,
      },
      createdBy: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  },
};
