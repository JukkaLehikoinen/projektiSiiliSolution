module.exports = (sequelize, DataTypes) => {
    const UserStory = sequelize.define('UserStory', {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'User',
                key: 'id',
            },
            primaryKey: true,
        },
        storyId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Story',
                key: 'id',
            },
            primaryKey: true,
        },
    })

    UserStory.associate = (models) => {
        UserStory.belongsTo(models.Story, { foreignKey: 'storyId', targetKey: 'id', onDelete: 'cascade' })
        UserStory.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', onDelete: 'cascade' })
    }

    return UserStory
}
