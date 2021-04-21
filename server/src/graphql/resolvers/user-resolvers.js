import { dataSources } from '../../datasources'

const schema = {
    Query: {
        allUsers() {
            return dataSources.boardService.getUsers()
        },
        userById(root, args) {
            return dataSources.boardService.getUserById(args.id)
        },
    },

    Mutation: {
        addUser(root, args) {
            return dataSources.boardService.addUser(args.userName, args.projectId)
        },
        deleteUser(root, args) {
            return dataSources.boardService.deleteUser(args.id, args.userName)
        },
    },
}

module.exports = schema
