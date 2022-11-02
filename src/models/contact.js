const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  Contact.init({
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
    subject: DataTypes.STRING,
    message: DataTypes.STRING,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Contact',
  });
  return Contact;
};
