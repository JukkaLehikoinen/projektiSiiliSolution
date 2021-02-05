'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserStory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserStory.belongsTo(models.Story, { foreignKey: 'storyId', targetKey: 'id', onDelete: 'cascade' })
        UserStory.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' })
    }
  };
  UserStory.init({
    userId: DataTypes.UUID,
    storyId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserStory',
  });
  return UserStory;
};