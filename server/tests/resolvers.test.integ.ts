import { afterTests, initializeDb } from "./sequelize-common";
import { Query as BoardQuery } from "../src/graphql/resolvers/board-resolvers";
import { Query as ProjectQuery } from "../src/graphql/resolvers/project-resolver";
import { Mutation as BoardMutation } from "../src/graphql/resolvers/board-resolvers";

describe('With initial test data in the database, graphql queries',   () => {
    // Reinitialize the database before each test in this describe block
    beforeEach(async () => await initializeDb())

    test('allBoards query returns all the boards in the database', async () => {
        const response = await BoardQuery.allBoards()
        console.log(response)
        console.log(response.slice().map(board => console.log(board.id)))
        expect(response.slice().length).toEqual(4)
    })

    test('allProject query returns all the boards in the database', async () => {
        const response = await ProjectQuery.allProjects()
        console.log(response.slice().map(project => console.log(project.id)))
        expect(response.slice().length).toEqual(1)
    })

})


describe('mutations', () => {
    // Reinitialize the database before each test in this describe block
    beforeEach(() => initializeDb())

    test('should add board to db', async () => {
        const boards = await BoardQuery.allBoards()
        expect(boards.length).toEqual(4)
        await BoardMutation.addBoard(null, {
            name: 'PO:n taulu 2',
            prettyId: 'PO2',
            eventId: '9da1b35f-181a-4397-a5a5-47abced10a66',
            projectId: '9da1b35f-181a-4397-a5a5-47abced10a66'
        })

        const board = await BoardQuery.allBoards()
        expect(board.length).toEqual(5)
    })

})
afterAll(() => afterTests())
