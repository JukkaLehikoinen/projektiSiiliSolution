const { Sequelize } = require('sequelize');
async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ColorTasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
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