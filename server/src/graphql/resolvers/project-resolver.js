import { pubsub } from "../subs"
import { dataSources } from '../../datasources'
import { withFilter } from "graphql-subscriptions"

const PROJECT_REMOVED = "PROJECT_REMOVED"
const PROJECT_ADDED = "PROJECT_ADDED";

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
        },
    },

    Subscription: {
        projectRemoved: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(PROJECT_REMOVED),
                (payload, args) =>
                    args.id === payload.id && args.eventId !== payload.eventId
            ),
        },
        projectAdded: {
            subscribe: withFilter(
                () => pubsub.asyncIterator(PROJECT_ADDED),
                (payload, args) =>
                    args.projectId === payload.projectId &&
                    args.eventId !== payload.eventId
            ),
        },
    },

    Mutation: {
        async addProject(root, { name, eventId }) {
            const addedProject = await dataSources.boardService.addProject(
                name
            );
            await pubsub.publish(PROJECT_ADDED, {
                projectId,
                eventId,
                projectAdded: {
                    mutationType: "CREATED",
                    project: addedProject.dataValues,
                },
            });
            return addedProject;
        },

        async archiveProjectById(root, args) {
            try {
                await dataSources.boardService.archiveProjectById(args.id)
                await pubsub.publish(PROJECT_REMOVED, {
                    id,
                    eventId,
                    projectRemoved: {
                        removeType: "ARCHIVED",
                        removeInfo: { id: id, eventId },
                    },
                });
            } catch (e) {
                console.log(e);
            }

            return id;
        },
    },
    Project: {
        boards(root) {
            return dataSources.boardService.getBoardsByProjectId(root.id)
        },
    },

};
module.exports = schema
