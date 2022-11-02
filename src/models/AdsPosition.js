const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdsPosition extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdsPosition.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      set(rawValue) {
        this.setDataValue('name', rawValue.toUpperCase());
      },
    },
    show: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'AdsPosition',
  });
  return AdsPosition;
};
