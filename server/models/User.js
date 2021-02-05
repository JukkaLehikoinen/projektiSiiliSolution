'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Story, {
        foreignKey: 'ownerId',
    })
    // User may have created multiple tasks
    User.hasMany(models.Task, {
        foreignKey: 'ownerId',
    })
    User.belongsToMany(models.Story, {
        through: models.UserStory,
        foreignKey: 'userId',
    })
    // User may be working on multiple tasks
    User.belongsToMany(models.Task, {
        through: models.UserTask,
        foreignKey: 'userId',
    })
    // user may be working on multiple subtasks
    User.belongsToMany(models.Subtask, {
        through: models.UserSubtask,
        foreignKey: 'userId',
    })
    }
  };
  User.init({
    userName: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};