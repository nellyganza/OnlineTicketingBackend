const { values } = require('lodash');
const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventSittingPlace extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.EventSittingPlace.belongsTo(models.Event, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
      });
    }
  }
  EventSittingPlace.init({
    eventId: DataTypes.UUID,
    name: DataTypes.STRING,
    totalPlaces: DataTypes.INTEGER,
    numberOfpeople: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    placesLeft: {
      type: DataTypes.INTEGER,
    },
    placeAvailable: DataTypes.ARRAY(DataTypes.RANGE(DataTypes.INTEGER)),
  }, {
    sequelize,
    modelName: 'EventSittingPlace',
  });
  return EventSittingPlace;
};
