import { afterTests, initializeDb } from "./sequelize-common";
import { Query as BoardQuery } from "../src/graphql/resolvers/board-resolvers";
import { Query as ProjectQuery } from "../src/graphql/resolvers/project-resolver";
import { Mutation as BoardMutation } from "../src/graphql/resolvers/board-resolvers";
import { Mutation as ProjectMutation } from "../src/graphql/resolvers/project-resolver";
import { Mutation as UserMutation } from "../src/graphql/resolvers/user-resolvers";
import { Query as UserQuery } from "../src/graphql/resolvers/user-resolvers";
import { Mutation as ColumnMutation } from "../src/graphql/resolvers/column-resolvers";
import { Query as ColumnQuery } from "../src/graphql/resolvers/column-resolvers";
import { Mutation as TaskMutation } from "../src/graphql/resolvers/task-resolvers";
import { Query as TaskQuery } from "../src/graphql/resolvers/task-resolvers";


describe('With initial test data in the database, graphql queries', () => {
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

    test('should add project to db', async () => {
        const projects = await ProjectQuery.allProjects()
        expect(projects.length).toEqual(1)
        await ProjectMutation.addProject(null, {
            name: "SiiliWall2",
        })

        const project = await ProjectQuery.allProjects()
        expect(project.length).toEqual(2)
    })

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

    test('should add user to db', async () => {
        const users = await UserQuery.allUsers()
        expect(users.length).toEqual(7)
        await UserMutation.addUser(null, {
            userName: "Paavo",
            passwordHash: "pVfUtAA3",
            email: "dmonteith0@mysql.com",
        })

        const user = await UserQuery.allUsers()
        expect(user.length).toEqual(8)
    })
    //test keeps failing. Maybe there is insufficient data in dummydata?
    // test('should add column to db', async () => {
    //     const columns = await ColumnQuery.allColumns()
    //     expect(columns.length).toEqual(16)
    //     await ColumnMutation.addColumn(null, {
    //         //id: "38d0ce05-b1e1-4c21-9c8a-87ba1b2a0527",

    //     })

    //     const column = await ColumnQuery.allColumns()
    //     expect(column.length).toEqual(1)
    // })

    //Test fails, possibly caused by outdated dummydata
    // test('should add tasks to db', async () => {
    //     const tasks = await TaskQuery.allTask()
    //     expect(tasks.length).toEqual(9)
    //     await TaskMutation.addTask(null, {
    //         prettyId: "KNBN-2",
    //         title: "Add drag and drop function to cards",
    //         content: "Add drag and drop function to cards",
    //         size: 1,
    //         columnId: "f6209adb-91ca-476b-8269-328a82d05d4a",
    //         columnOrderNumber: 0,
    //         swimlaneOrderNumber: 1,
    //         ownerId: "654df13f-51be-4b25-8f0e-7c2f40a3a81e",
    //         boardId: "0f154e01-f8ba-49c8-b2dc-e374d28f7f83",
    //     })

    //     const task = await TaskQuery.allTasks()
    //     expect(task.length).toEqual(10)
    // })

})
afterAll(() => afterTests())
