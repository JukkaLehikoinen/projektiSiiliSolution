'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Column extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Column.belongsTo(models.Board, {
        foreignKey: 'boardId',
    })
    Column.hasMany(models.Story, {
        foreignKey: 'columnId',
    })
    Column.hasMany(models.Task, {
        foreignKey: 'columnId',
    })
    Column.hasMany(models.Subtask, {
        foreignKey: 'columnId',
    })
    }
  };
  Column.init({
    name: DataTypes.STRING,
    orderNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Column',
  });
  return Column;
};