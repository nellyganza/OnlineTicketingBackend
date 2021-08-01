const { string, date } = require('joi');
const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Users.belongsTo(models.Roles, {
        foreignKey: 'RoleId',
        onDelete: 'CASCADE',
      });
      models.Users.hasMany(models.Event, {
        foreignKey: 'userId',
      });
      models.Users.hasMany(models.Ticket, {
        foreignKey: 'userId',
      });
      models.Users.hasMany(models.Transactions, {
        foreignKey: 'user',
      });
      models.Users.hasMany(models.Notification, {
        foreignKey: 'userId',
      });
    }
  }
  Users.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    RoleId: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING,
    category: DataTypes.STRING,
    campanyName: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    socialId: DataTypes.STRING,
    provider: DataTypes.STRING,
    authToken: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
