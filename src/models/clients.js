const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Clients.init({
    title: DataTypes.STRING,
    image: {
      type: DataTypes.BLOB('long'),
      get() {
        const imagevalue = this.getDataValue('image');
        return `data:image/bmp;base64,${imagevalue.toString('base64')}`;
      },
    },
  }, {
    sequelize,
    modelName: 'Clients',
  });
  return Clients;
};
