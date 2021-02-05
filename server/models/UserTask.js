'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserTask.belongsTo(models.Task, { foreignKey: 'taskId', targetKey: 'id', onDelete: 'cascade' })
      UserTask.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' })
    }
  };
  UserTask.init({
    userId: DataTypes.UUID,
    taskId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserTask',
  });
  return UserTask;
};