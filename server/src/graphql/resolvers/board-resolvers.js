const { pubsub } = require("../subs");
const { dataSources } = require("../../datasources");
const { withFilter } = require("graphql-subscriptions");

const SWIMLANE_MOVED = "SWIMLANE_MOVED";
const BOARD_ADDED = "BOARD_ADDED";
const BOARD_REMOVED = "BOARD_REMOVED";

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
    boardRemoved: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(BOARD_REMOVED),
        (payload, args) =>
          args.projectId === payload.projectId &&
          args.eventId !== payload.eventId
      ),
    },
  },

  Mutation: {
    async deleteBoard(root, { id, name, projectId, eventId }) {
      let deletedBoard;
      try {
        deletedBoard = await dataSources.boardService.deleteBoard(id);
        await pubsub.publish(BOARD_REMOVED, {
          projectId,
          eventId,
          boardRemoved: {
            removeType: "DELETED",
            removeInfo: { boardId: id, projectId },
          },
        });
      } catch (e) {
        console.log(e);
      }
      return deletedBoard;
    },

    async addBoard(root, { name, prettyId, eventId, projectId }) {
      const addedBoard = await dataSources.boardService.addBoard(
        name,
        prettyId,
        projectId
      );
      await pubsub.publish(BOARD_ADDED, {
        projectId,
        eventId,
        boardAdded: {
          mutationType: "CREATED",
          board: addedBoard.dataValues,
        },
      });
      return addedBoard;
    },

    async archiveBoardById(root, { boardId, projectId, eventId }) {
      try {
        await dataSources.boardService.archiveBoardById(boardId);
        await pubsub.publish(BOARD_REMOVED, {
          projectId,
          eventId,
          boardRemoved: {
            removeType: "ARCHIVED",
            removeInfo: { boardId: boardId, projectId },
          },
        });
      } catch (e) {
        console.log(e);
      }

      return boardId;
    },
    restoreBoardById(root, { id }) {
      return dataSources.boardService.restoreBoardById(id);
    },

    async moveSwimlane(
      root,
      { boardId, affectedSwimlanes, swimlaneOrder, eventId }
    ) {
      await pubsub.publish(SWIMLANE_MOVED, {
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
