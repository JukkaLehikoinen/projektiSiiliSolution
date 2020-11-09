const { withFilter } = require('graphql-subscriptions')
const dataSources = require('../../datasources')
const { pubsub } = require('../pubsub')

const SUBTASK_MUTATED = 'SUBTASK_MUTATED'
const SUBTASK_REMOVED = 'SUBTASK_REMOVED'

const schema = {

    Subscription: {
        subtaskMutated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(SUBTASK_MUTATED),
                (payload, args) => args.boardId === payload.boardId,
            ),
        },
        subtaskRemoved: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(SUBTASK_REMOVED),
                (payload, args) => (args.boardId === payload.boardId && args.eventId !== payload.eventId)
            )
        }
    },

    Mutation: {
        async addSubtaskForTask(root, {
            taskId, columnId, boardId, name, content, size, ownerId, memberIds, ticketOrder,
        }) {
            const addedSubtask = await dataSources.boardService.addSubtaskForTask(taskId, columnId, boardId, name, content, size, ownerId, memberIds, ticketOrder)
            pubsub.publish(SUBTASK_MUTATED, {
                boardId,
                subtaskMutated: {
                    mutationType: 'CREATED',
                    subtask: addedSubtask.dataValues,
                },
            })
            return addedSubtask
        },

        addMemberForSubtask(root, { id, userId }) {
            return dataSources.boardService.addMemberForSubtask(id, userId)
        },

        async deleteSubtaskById(root, { id, columnId, boardId, eventId }) {
            console.log(eventId)
            let deletedSubtask
            try {
                deletedSubtask = await dataSources.boardService.deleteSubtaskById(id)
                pubsub.publish(SUBTASK_REMOVED, {
                    boardId,
                    eventId,
                    subtaskRemoved: {
                        removeType: 'DELETED',
                        removeInfo: {
                            subtaskId: id,
                            columnId,
                            boardId
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
            return deletedSubtask
        },

        async archiveSubtaskById(root, { id, columnId, boardId, eventId }) {
            let archivedSubtask
            try {
                archivedSubtask = await dataSources.boardService.archiveSubtaskById(id)
                pubsub.publish(SUBTASK_REMOVED, {
                    boardId,
                    eventId,
                    subtaskRemoved: {
                        removeType: 'ARCHIVED',
                        removeInfo: {
                            subtaskId: id,
                            columnId,
                            boardId
                        }
                    }
                })
            } catch (e) {
                console.log(e)
            }
            return archivedSubtask
        },

        async editSubtaskById(root, {
            id, name, content, size, ownerId, oldMemberIds, newMemberIds,
        }) {
            const editedSubtask = await dataSources.boardService.editSubtaskById(id, name, content, size, ownerId, oldMemberIds, newMemberIds)
            pubsub.publish(SUBTASK_MUTATED, {
                boardId: editedSubtask.boardId,
                subtaskMutated: {
                    mutationType: 'UPDATED',
                    subtask: editedSubtask.dataValues,
                },
            })
            return editedSubtask
        },
    },

    Subtask: {
        task(root) {
            return dataSources.boardService.getTaskById(root.taskId)
        },
        column(root) {
            return dataSources.boardService.getColumnById(root.columnId)
        },
        board(root) {
            return dataSources.boardService.getBoardById(root.boardId)
        },
        owner(root) {
            if (!root.ownerId) {
                return null
            }
            return dataSources.boardService.getOwnerById(root.ownerId)
        },
        members(root) {
            return dataSources.boardService.getMembersBySubtaskId(root.id)
        },
    },
}

module.exports = schema
