module.exports = (sequelize, DataTypes) => {
    const UserSubtask = sequelize.define('UserSubtask', {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
            primaryKey: true,
        },
        subtaskId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Subtask',
                key: 'id',
            },
            primaryKey: true,
        },
    })

    UserSubtask.associate = (models) => {
        UserSubtask.belongsTo(models.Subtask, { foreignKey: 'subtaskId', targetKey: 'id', onDelete: 'cascade' })
        UserSubtask.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' })
    }

    return UserSubtask
}
