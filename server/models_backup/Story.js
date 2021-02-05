module.exports = (sequelize, DataTypes) => {
    const Story = sequelize.define('Story', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.STRING,
        color: DataTypes.STRING,
        size: DataTypes.DOUBLE,
        deletedAt: DataTypes.DATE,
    })
    Story.associate = (models) => {
        Story.belongsTo(models.Column, {
            foreignKey: 'columnId',
        })
        Story.belongsTo(models.User, {
            foreignKey: 'ownerId',
        })
        Story.belongsToMany(models.User, {
            through: models.UserStory,
            foreignKey: 'storyId',
        })
        Story.belongsTo(models.Board, {
            foreignKey: 'boardId',
        })
    }
    return Story
}
