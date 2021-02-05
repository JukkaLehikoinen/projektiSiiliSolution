'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ColorTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ColorTask.init({
    colorId: DataTypes.UUID,
    taskId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'ColorTask',
  });
  return ColorTask;
};