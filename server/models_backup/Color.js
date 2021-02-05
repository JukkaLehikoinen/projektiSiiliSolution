module.exports = (sequelize, DataTypes) => {
    const Color = sequelize.define('Color', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        color: {
            type: DataTypes.STRING,
        }
    })
    Color.associate = (models) => {
        Color.belongsToMany(models.Task, {
            through: models.ColorTask,
            foreignKey: 'colorId',
        })
        Color.belongsToMany(models.Subtask, {
            through: models.ColorSubtask,
            foreignKey: 'colorId',
        })
    }
    return Color
}