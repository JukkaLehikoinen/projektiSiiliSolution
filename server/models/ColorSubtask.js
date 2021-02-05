'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ColorSubtask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ColorSubtask.belongsTo(models.Subtask, { foreignKey: 'subtaskId', targetKey: 'id', onDelete: 'cascade' })
      ColorSubtask.belongsTo(models.Color, { foreignKey: 'colorId', targetKey: 'id', onDelete: 'cascade' })
    }
  };
  ColorSubtask.init({
    subtaskId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'ColorSubtask',
  });
  return ColorSubtask;
};