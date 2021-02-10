const { SquareFootTwoTone } = require('@material-ui/icons');
const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tasks', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      prettyId: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      size:{
        type: Sequelize.INTEGER
      },
      columnId: {
        type: Sequelize.UUID
      },
      columnOrderNumber: {
        type: Sequelize.INTEGER
      },
      swimlaneOrderNumber:{
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.UUID
      },
      ownerId: {
        type: Sequelize.UUID
      },
      boardId:{
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  }
}
async function down({ context: queryInterface }) {
await queryInterface.dropTable('Tasks');
}

module.exports = { up, down };