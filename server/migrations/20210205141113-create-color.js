const { Sequelize } = require('sequelize');
const { boards, colors } = require('../dummyData');

async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Colors', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.UUID
      // },
      id: {
        type: Sequelize.UUID
      },
      type: {
        type: Sequelize.STRING
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
  await queryInterface.dropTable('Colors');
}

module.exports = { up, down };