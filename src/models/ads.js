const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ads extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Ads.belongsTo(models.AdsPosition, {
        foreignKey: 'AdsPositionId',
      });
    }
  }
  Ads.init({
    image: DataTypes.STRING,
    AdsPositionId: DataTypes.UUID,
    priority: DataTypes.INTEGER,
    link: DataTypes.TEXT,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Ads',
  });
  return Ads;
};
