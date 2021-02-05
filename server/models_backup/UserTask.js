module.exports = (sequelize, DataTypes) => {
    const UserTask = sequelize.define('UserTask', {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
            primaryKey: true,
        },
        taskId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Task',
                key: 'id',
            },
            primaryKey: true,
        },
    })

    UserTask.associate = (models) => {
        UserTask.belongsTo(models.Task, { foreignKey: 'taskId', targetKey: 'id', onDelete: 'cascade' })
        UserTask.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' })
    }

    return UserTask
}
