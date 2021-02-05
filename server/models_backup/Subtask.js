module.exports = (sequelize, DataTypes) => {
    const Subtask = sequelize.define('Subtask', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        prettyId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        columnOrderNumber: DataTypes.INTEGER,
        done: DataTypes.BOOLEAN,
        name: DataTypes.STRING,
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: DataTypes.FLOAT,
        deletedAt: DataTypes.DATE,
    })
    Subtask.associate = (models) => {
        Subtask.belongsTo(models.Board, {
            foreignKey: 'boardId',
        })
        Subtask.belongsTo(models.Task, {
            foreignKey: 'taskId',
        })
        Subtask.belongsTo(models.Column, {
            foreignKey: 'columnId',
        })
        // Subtask has one creator user
        Subtask.belongsTo(models.User, {
            foreignKey: 'ownerId',
        })
        // Subtask may have multiple users working on it
        Subtask.belongsToMany(models.User, {
            through: models.UserSubtask,
            foreignKey: 'subtaskId',
        })
        Subtask.belongsToMany(models.Color, {
            through: models.ColorSubtask,
            foreignKey: 'subtaskId',
        })
    }
    return Subtask
}
