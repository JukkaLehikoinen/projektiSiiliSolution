module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        prettyId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        columnOrderNumber: {
            type: DataTypes.INTEGER,
        },
        description: DataTypes.STRING,
        swimlaneOrderNumber: DataTypes.INTEGER,
        size: DataTypes.INTEGER,
        difficulty: DataTypes.INTEGER,
        deletedAt: DataTypes.DATE,
    })
    Task.associate = (models) => {
        Task.belongsTo(models.Column, {
            foreignKey: 'columnId',
        })
        Task.hasMany(models.Subtask, {
            foreignKey: 'taskId',
        })
        // Task has one creator user
        Task.belongsTo(models.User, {
            foreignKey: 'ownerId',
        })
        // Task may have multiple users working on it
        Task.belongsToMany(models.User, {
            through: models.UserTask,
            foreignKey: 'taskId',
        })
        Task.belongsToMany(models.Color, {
            through: models.ColorTask,
            foreignKey: 'taskId',
        })
        Task.belongsTo(models.Board, {
            foreignKey: 'boardId',
        })
    }
    return Task
}
