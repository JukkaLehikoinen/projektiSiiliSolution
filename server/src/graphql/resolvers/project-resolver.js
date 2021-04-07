//const { delete } = require("../../controllers/boards");
const {dataSources} = require("../../datasources");
const { pubsub } = require("../pubsub");

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
    
    Mutation: {
        async addProject(root, { name }) {
            return dataSources.boardService.addProject(name)
        },
        async deleteProjectById(root, {id}){
            let deleteProjectById
            try{
                deleteProjectById = await dataSources.boardService.deleteProjectById(id)
                pubsub.publish(PROJECT_DELETED, {
                    id,
                    projectRemoved: {
                        removeType: 'DELETED',
                        removeInfo: { Id: id},
                    },
                })
            }catch (e){
                console.log(e)
            }
            return deleteProjectById
        }
    },
    Project: {
        boards(root) {
            return dataSources.boardService.getBoardsByProjectId(root.id)
        }
    }
}
module.exports = schema
