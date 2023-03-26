const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Token.belongsTo(models.Users, {
        foreignKey: 'userId',
        onDelete: 'NO ACTION',
      });
    }
  }
  Token.init({
    token: {
      type: DataTypes.TEXT,
      primaryKey: true,
      allowNull: false,
    },
    userId: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};
