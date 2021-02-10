const { Sequelize } = require('sequelize');

async function up({ context: queryInterface }) {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subTasks', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },
      
      prettyId: {
       type: Sequelize.STRING
      },
      name:{
        type: Sequelize.STRING
      },
      done: {
        type: Sequelize.BOOLEAN
      },
      taskId:{
        type: Sequelize.UUID
      },
      boardId: {
        type: Sequelize.UUID
      },
      columnOrderNumber:{
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.UUID
      },
      columnId:{
        type: Sequelize.UUID
      },
      ownerId: {
        type: Sequelize.UUID
      },
      content: {
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
await queryInterface.dropTable('SubTasks');
}

module.exports = { up, down };