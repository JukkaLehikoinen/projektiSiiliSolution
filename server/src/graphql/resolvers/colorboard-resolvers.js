const dataSources = require('../../datasources')

const schema = {
    Query: {
        allEpicColors() {
            return dataSources.boardService.allEpicColors()
        },
    },

    Mutation: { 
        addEpicColors(root, args) {
            return dataSources.boardService.addEpicColors(args.colorId, args.boardId, args.name)
        },
    },
}

module.exports = schema
