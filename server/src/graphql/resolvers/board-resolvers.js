const { dataSources } = require("../../datasources");
const { withFilter } = require("graphql-subscriptions");
const { pubsub } = require("../subs");

const SWIMLANE_MOVED = "SWIMLANE_MOVED";
const BOARD_ADDED = "BOARD_ADDED";

const schema = {
  Query: {
    boardById(root, args) {
      return dataSources.boardService.getBoardById(args.id);
    },
    allBoards() {
      return dataSources.boardService.getBoards();
    },
  },

  Subscription: {
    swimlaneMoved: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(SWIMLANE_MOVED),
        (payload, args) =>
          args.boardId === payload.boardId && args.eventId !== payload.eventId
      ),
    },
    boardAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(BOARD_ADDED),
        (payload, args) =>
          args.projectId === payload.projectId &&
          args.eventId !== payload.eventId
      ),
    },
  },

  Mutation: {
    async addBoard(root, { name, prettyId, eventId, projectId }) {
      const addedBoard = await dataSources.boardService.addBoard(
        name,
        prettyId,
        projectId
      );
      pubsub.publish(BOARD_ADDED, {
        projectId,
        eventId,
        boardAdded: {
          mutationType: "CREATED",
          board: addedBoard.dataValues,
        },
      });
      return addedBoard;
    },

    async deleteBoardById(root, id) {
      let deleteBoardById;
      try {
        deleteBoardById = await dataSources.boardService.deleteBoardById(id);
        pubsub.publish(BOARD_DELETED, {
          id,
          boardRemoved: {
            removeType: "DELETED",
            removeInfo: { Id: id },
          },
        });
      } catch (e) {
        console.log(e);
      }
      return deleteBoardById;
    },

    moveSwimlane(root, { boardId, affectedSwimlanes, swimlaneOrder, eventId }) {
      pubsub.publish(SWIMLANE_MOVED, {
        boardId,
        eventId,
        swimlaneMoved: {
          boardId,
          affectedSwimlanes,
          swimlaneOrder,
        },
      });
      return dataSources.boardService.updateSwimlaneOrderNumbers(
        boardId,
        affectedSwimlanes
      );
    },
  },

  Board: {
    columns(root) {
      return dataSources.boardService.getColumnsByBoardId(root.id);
    },
    columnOrder(root) {
      return dataSources.boardService.getColumnOrderOfBoard(root.id);
    },
    swimlaneOrder(root) {
      return dataSources.boardService.getSwimlaneOrderOfBoard(root.id);
    },
  },
};

module.exports = schema;
