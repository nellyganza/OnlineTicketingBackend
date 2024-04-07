const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BusinessInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.BusinessInfo.belongsTo(models.Users, {
        foreignKey: 'userId',
      });

      models.BusinessInfo.belongsTo(models.Account, {
        foreignKey: 'account',
      });

      models.BusinessInfo.belongsTo(models.Representative, {
        foreignKey: 'representative',
      });
    }
  }
  BusinessInfo.init({
    registrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: DataTypes.STRING,
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },
    representative: DataTypes.UUID,
    account: {
      type: DataTypes.UUID,
      unique: true,
    },
  }, {
    sequelize,
    modelName: 'BusinessInfo',
  });
  return BusinessInfo;
};
