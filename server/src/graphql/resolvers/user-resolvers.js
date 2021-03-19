const {dataSources} = require("../../datasources");

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
    },
}

module.exports = schema
