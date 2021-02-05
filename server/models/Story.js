'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Story.belongsTo(models.Column, {
        foreignKey: 'columnId',
    })
    Story.belongsTo(models.User, {
        foreignKey: 'ownerId',
    })
    Story.belongsToMany(models.User, {
        through: models.UserStory,
        foreignKey: 'storyId',
    })
    Story.belongsTo(models.Board, {
        foreignKey: 'boardId',
    })
    }
  };
  Story.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    color: DataTypes.STRING,
    size: DataTypes.DOUBLE,
    deleteAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Story',
  });
  return Story;
};