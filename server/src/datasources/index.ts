const { BoardService } = require('./BoardService')

const dataSources = {
    boardService: new BoardService(),
}

module.exports = dataSources
