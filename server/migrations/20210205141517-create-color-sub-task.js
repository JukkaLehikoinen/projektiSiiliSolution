const { Sequelize } = require('sequelize');
const { colorsubtasks } = require('../dummyData');

async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ColorSubTasks', {
      // id: {
      //   allowNull: false,
      //   //autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.UUID
      // },
      id: {
        type: Sequelize.UUID
      },
      subtaskId: {
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
  await queryInterface.dropTable('ColorSubTask');
}

module.exports = { up, down };