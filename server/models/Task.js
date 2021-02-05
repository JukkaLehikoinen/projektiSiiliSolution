'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Task.belongsTo(models.Column, {
        foreignKey: 'columnId',
    })
    Task.hasMany(models.Subtask, {
        foreignKey: 'taskId',
    })
    // Task has one creator user
    Task.belongsTo(models.User, {
        foreignKey: 'ownerId',
    })
    // Task may have multiple users working on it
    Task.belongsToMany(models.User, {
        through: models.UserTask,
        foreignKey: 'taskId',
    })
    Task.belongsToMany(models.Color, {
        through: models.ColorTask,
        foreignKey: 'taskId',
    })
    Task.belongsTo(models.Board, {
        foreignKey: 'boardId',
    })
    }
  };
  Task.init({
    prettyId: DataTypes.STRING,
    title: DataTypes.STRING,
    columnOrderNumber: DataTypes.INTEGER,
    description: DataTypes.STRING,
    swimlaneOrderNumber: DataTypes.INTEGER,
    size: DataTypes.INTEGER,
    difficulty: DataTypes.INTEGER,
    deleteAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};