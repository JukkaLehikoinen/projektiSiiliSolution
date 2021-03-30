import { dataSources } from "../../datasources";

const schema = {

    Query: {

        allColors() {
            return dataSources.boardService.getColors()
        },
    },
}

module.exports = schema
