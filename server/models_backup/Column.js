module.exports = (sequelize, DataTypes) => {
    const Column = sequelize.define('Column', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    })
    Column.associate = (models) => {
        Column.belongsTo(models.Board, {
            foreignKey: 'boardId',
        })
        Column.hasMany(models.Story, {
            foreignKey: 'columnId',
        })
        Column.hasMany(models.Task, {
            foreignKey: 'columnId',
        })
        Column.hasMany(models.Subtask, {
            foreignKey: 'columnId',
        })
    }
    return Column
}
