const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Boards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      prettyId: {
        type: Sequelize.STRING
      },
      ticketCount: {
        type: Sequelize.INTEGER
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
  }
}
  

  async function down({ context: queryInterface }) {
    await queryInterface.dropTable('Boards');
  }

module.exports = { up, down };