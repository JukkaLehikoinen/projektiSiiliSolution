'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       
        Color.belongsToMany(models.Task, {
            through: models.ColorTask,
            foreignKey: 'colorId',
        })
        Color.belongsToMany(models.Subtask, {
            through: models.ColorSubtask,
            foreignKey: 'colorId',
        })
    }
    
  };
  Color.init({
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Color',
  });
  return Color;
};