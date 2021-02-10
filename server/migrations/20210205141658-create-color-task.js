const { Sequelize } = require('sequelize');
const { colortasks } = require('../dummyData');

async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ColorTasks', {
      // id: {
      //   allowNull: false,
      //  // autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.UUID
      // },
      id: {
        type: Sequelize.UUID
      },
      colorId: {
        type: Sequelize.UUID
      },
      taskId: {
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
  await queryInterface.dropTable('ColorTasks');
}

module.exports = { up, down };