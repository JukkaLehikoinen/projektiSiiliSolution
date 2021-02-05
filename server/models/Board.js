'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Board.hasMany(models.Column, {
        foreignKey: 'boardId',
    })
    // Board has one creator user
    Board.belongsTo(models.User, {
        foreignKey: 'creatorId',
    })
    Board.hasMany(models.Story, {
        foreignKey: 'boardId',
    })
    Board.hasMany(models.Task, {
        foreignKey: 'boardId',
    })
    Board.belongsTo(models.Project, {
        foreignKey: 'projectId'
    })
    }
  };
  Board.init({
    prettyId: DataTypes.STRING,
    ticketCount: DataTypes.INTEGER,
    name: DataTypes.STRING,
    orderNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};