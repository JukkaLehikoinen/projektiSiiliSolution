'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subtask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Subtask.belongsTo(models.Board, {
        foreignKey: 'boardId',
    })
    Subtask.belongsTo(models.Task, {
        foreignKey: 'taskId',
    })
    Subtask.belongsTo(models.Column, {
        foreignKey: 'columnId',
    })
    // Subtask has one creator user
    Subtask.belongsTo(models.User, {
        foreignKey: 'ownerId',
    })
    // Subtask may have multiple users working on it
    Subtask.belongsToMany(models.User, {
        through: models.UserSubtask,
        foreignKey: 'subtaskId',
    })
    Subtask.belongsToMany(models.Color, {
        through: models.ColorSubtask,
        foreignKey: 'subtaskId',
    })
    }
  };
  Subtask.init({
    prettyId: DataTypes.STRING,
    columnOrderNumber: DataTypes.INTEGER,
    done: DataTypes.BOOLEAN,
    name: DataTypes.STRING,
    content: DataTypes.STRING,
    size: DataTypes.FLOAT,
    deleteAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Subtask',
  });
  return Subtask;
};