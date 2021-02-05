'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSubtask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserSubtask.belongsTo(models.Subtask, { foreignKey: 'subtaskId', targetKey: 'id', onDelete: 'cascade' })
      UserSubtask.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' })
    }
  };
  UserSubtask.init({
    userId: DataTypes.UUID,
    subtaskId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserSubtask',
  });
  return UserSubtask;
};