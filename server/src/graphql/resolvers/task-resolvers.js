/* eslint-disable max-len */
const dataSources = require('../../datasources')

const schema = {
    Query: {
        taskById(root, args) {
            return dataSources.boardService.getTaskById(args.id)
        },
    },

    Mutation: {
        addMemberForTask(root, {
            id, userId,
        }) {
            return dataSources.boardService.addMemberForTask(id, userId)
        },
        addTaskForColumn(root, {
            columnId, title, size, ownerId, content, memberIds,
        }) {
            return dataSources.boardService
                .addTaskForColumn(columnId, title, size, ownerId, content, memberIds)
        },
        editTaskById(root, {
            id, title, size, ownerId, oldMemberIds, newMemberIds,
        }) {
            return dataSources.boardService.editTaskById(id, title, size, ownerId, oldMemberIds, newMemberIds)
        },
        deleteTaskById(root, { id }) {
            return dataSources.boardService.deleteTaskById(id)
        },
        archiveTaskById(root, { id }) {
            return dataSources.boardService.archiveTaskById(id)
        },
        restoreTaskById(root, { id }) {
            return dataSources.boardService.restoreTaskById(id)
        },
    },

    Task: {
        column(root) {
            return dataSources.boardService.getColumnById(root.columnId)
        },
        subtasks(root) {
            return dataSources.boardService.getSubtasksByTaskId(root.id)
        },
        subtaskOrder(root) {
            return dataSources.boardService.getSubtaskOrderOfTask(root.id)
        },
        owner(root) {
            if (!root.ownerId) {
                return null
            }
            return dataSources.boardService.getOwnerById(root.ownerId)
        },
        members(root) {
            return dataSources.boardService.getMembersByTaskId(root.id)
        },
    },
}

module.exports = schema
