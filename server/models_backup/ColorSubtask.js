module.exports = (sequelize, DataTypes) => {
    const ColorSubtask = sequelize.define('ColorSubtask', {
        colorId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Color',
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

    ColorSubtask.associate = (models) => {
        ColorSubtask.belongsTo(models.Subtask, { foreignKey: 'subtaskId', targetKey: 'id', onDelete: 'cascade' })
        ColorSubtask.belongsTo(models.Color, { foreignKey: 'colorId', targetKey: 'id', onDelete: 'cascade' })
    }

    return ColorSubtask
}