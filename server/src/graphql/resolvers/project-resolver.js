const { dataSources } = require("../../datasources");
const { withFilter } = require("graphql-subscriptions");
const { pubsub } = require("../subs");

const PROJECT_REMOVED = "PROJECT_REMOVED";

const schema = {
    Query: {
        projectById(root, args) {
            return dataSources.boardService.getProjectById(args.id)
        },
        boardsByProjectId(root, args) {
            return dataSources.boardService.getBoardsByProjectId(args.id)
        },
        allProjects() {
            return dataSources.boardService.getProjects().catch(e => console.log(e))
        }
    },

    Subscription: {
        projectRemoved: {
          subscribe: withFilter(
            () => pubsub.asyncIterator(PROJECT_REMOVED),
            (payload, args) =>
              args.projectId === payload.projectId &&
              args.eventId !== payload.eventId
          ),
        },
      },
    
    Mutation: {
        async addProject(root, { name }) {
            return dataSources.boardService.addProject(name)
        },
        async archiveProjectById(root, { projectId, eventId }) {
            try {
              await dataSources.boardService.archiveProjectById(projectId);
              await pubsub.publish(PROJECT_REMOVED, {
                eventId,
                projectRemoved: {
                  removeType: "ARCHIVED",
                  removeInfo: { projectId: projectId },
                },
              });
            } catch (e) {
              console.log(e);
            }
      
            return projectId;
          },
    },
    Project: {
        boards(root) {
            return dataSources.boardService.getBoardsByProjectId(root.id)
        }
    }
}
module.exports = schema
