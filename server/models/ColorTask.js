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
      ColorTask.belongsTo(models.Task, { foreignKey: 'taskId', targetKey: 'id', onDelete: 'cascade' })
      ColorTask.belongsTo(models.Color, { foreignKey: 'colorId', targetKey: 'id', onDelete: 'cascade' })
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