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
      // define association here
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