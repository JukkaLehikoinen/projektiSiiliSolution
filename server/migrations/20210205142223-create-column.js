const { Sequelize } = require('sequelize');
const { columns } = require('../dummyData');

async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Columns', {
      // id: {
      //   allowNull: false,
      //  // autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.UUID
      // },
      id: {
        type: Sequelize.UUID
      },
      name: {
        type: Sequelize.STRING
      },
      orderNumber: {
        type: Sequelize.INTEGER
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
  }}

  async function down({ context: queryInterface }) {
    await queryInterface.dropTable('Columns');
  }
  
  module.exports = { up, down };