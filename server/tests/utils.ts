import Board from "../src/models/Board";
import User from "../src/models/User";
import Column from "../src/models/Column";
import Subtask from "../src/models/Subtask";
import Task from "../src/models/Task";
import Story from "../src/models/Story";
import {dbConfig} from "../src/database";
import {expressApp} from "../src/express";
import Project from "../src/models/Project";
import Color from "../src/models/Color";
import ColorSubtask from "../src/models/ColorSubtask";
import ColorTask from "../src/models/ColorTask";
import UserSubtask from "../src/models/UserSubtask";
import UserStory from "../src/models/UserStory";
import Usertask from "../src/models/UserTask";

const supertest = require('supertest')
// const db = require('../models/index.js')
const dummyData = require('./dummyData')
// const { closeHttpServer } = require('../src/index.js')
// const { app } = require('../src/index.js')

const request = supertest(expressApp)

/*
  Drop all the tables, sync the models with the database,
  insert some testdata and return a promise when everything has resolved
*/
export const initializeDb = async () => {
    try {
        await dbConfig.sync({ force: true })
        await Promise.all(
            dummyData.users.map(async (user) => {
                const resolved = await User.create(user)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.projects.map(async (project) => {
                const resolved = await Project.create(project)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.colors.map(async (color) => {
                const resolved = await Color.create(color)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.boards.map(async (board) => {
                const resolved = await Board.create(board)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.columns.map(async (column) => {
                const resolved = await Column.create(column)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.stories.map(async (story) => {
                const resolved = await Story.create(story)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.tasks.map(async (task) => {
                const resolved = await Task.create(task)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.subtasks.map(async (subtask) => {
                const resolved = await Subtask.create(subtask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.colorsubtasks.map(async (colorsubtask) => {
                const resolved = await ColorSubtask.create(colorsubtask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.colortasks.map(async (colortask) => {
                const resolved = await ColorTask.create(colortask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.userSubtasks.map(async (usersubtask) => {
                const resolved = await UserSubtask.create(usersubtask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.usertasks.map(async (usertask) => {
                const resolved = await Usertask.create(usertask)
                return resolved
            }),
        )
        await Promise.all(
            dummyData.userStories.map(async (userstory) => {
                const resolved = await UserStory.create(userstory)
                return resolved
            }),
        )
    } catch (e) {
        console.log(e)
    }

    return Promise.resolve()
}

export const afterTests = async () => {
    // closeHttpServer()
    try {
        await dbConfig.drop()
        await dbConfig.close()
    } catch (e) {
        console.log(e)
    }
    return Promise.resolve()
}

export const boardsInTheDb = async () => {
    try {
        const boardsInTheDatabase = await Board.findAll()
        return boardsInTheDatabase
    } catch (e) {
        console.log(e)
    }
}

export const columnsOfBoardInTheDb = async (id) => {
    try {
        const columns = await Column.findAll({ where: { boardId: id } })
        return columns
    } catch (e) {
        console.log(e)
    }
}

export const columnsInTheDb = async () => {
    try {
        const columns = await Column.findAll()
        return columns
    } catch (e) {
        console.log(e)
    }
}

const storiesOfColumnInTheDb = async (id) => {
    try {
        const stories = await Story.findAll({ where: { columnId: id } })
        return stories
    } catch (e) {
        console.log(e)
    }
}

const storiesInTheDb = async () => {
    try {
        const stories = await Story.findAll()
        return stories
    } catch (e) {
        console.log(e)
    }
}

const storyById = async (id) => {
    let story
    try {
        story = await Story.findByPk(id)
    } catch (e) {
        console.log(e)
    }
    return story
}

export const tasksOfColumnInTheDb = async (id) => {
    try {
        const tasks = await Task.findAll({ where: { columnId: id } })
        return tasks
    } catch (e) {
        console.log(e)
    }
}

export const tasksInTheDb = async () => {
    try {
        const tasks = await Task.findAll()
        return tasks
    } catch (e) {
        console.log(e)
    }
}

export const taskById = async (id) => {
    let task
    try {
        task = await Task.findByPk(id)
    } catch (e) {
        console.log(e)
    }
    return task
}

export const getTaskOrderOfColumn = async (columnId) => {
    let arrayOfIds
    try {
        const tasks = await Task.findAll({
            attributes: ['id'],
            where: { columnId },
            order: dbConfig.Sequelize.literal('columnOrderNumber ASC'),
        })
        arrayOfIds = tasks.map((task) => task.getDataValue("id"))
    } catch (e) {
        console.log(e)
    }
    return arrayOfIds
}

export const subtasksOfTaskInTheDb = async (taskId) => {
    let subtasks
    try {
        subtasks = await Subtask.findAll({
            where: { taskId },
        })
        return subtasks
    } catch (e) {
        console.log(e)
    }
}

export const subtasksInTheDb = async () => {
    let subtasks
    try {
        subtasks = await Subtask.findAll()
        return subtasks
    } catch (e) {
        console.log(e)
    }
}

export const initialBoards = dummyData.boards

export const testCall = async (query) => {await request
    .post('/graphql')
    .send({ query })
    }

/* const taskOrderAtStart = await getTaskOrderOfColumn('7bce34e5-385b-41e6-acd3-ceb4bd57b4f6')
        const newTaskOrderArray = [
            '6e766c63-0684-4cf2-8a46-868cfaf84033',
            'b8d2d626-d6a8-4c9a-89f3-a77796d2b2f3',
            'e12d6ed1-c275-4047-8f3c-b50050bada6d',
        ]
        expect(newTaskOrderArray).not.toStrictEqual(taskOrderAtStart)
        const response = await testCall(`mutation {
                moveTaskInColumn(newOrder: [
                    "6e766c63-0684-4cf2-8a46-868cfaf84033",
                    "b8d2d626-d6a8-4c9a-89f3-a77796d2b2f3",
                    "e12d6ed1-c275-4047-8f3c-b50050bada6d",
                ], columnId: "7bce34e5-385b-41e6-acd3-ceb4bd57b4f6") {id taskOrder}
        }`)
        // expect taskOrder in mutation's response to be the same we asked for
        expect(response.body.data.moveTaskInColumn.taskOrder).toStrictEqual(newTaskOrderArray)

        const taskOrderAtEnd = await getTaskOrderOfColumn('7bce34e5-385b-41e6-acd3-ceb4bd57b4f6')
        // expect taskOrder to have changed
        expect(taskOrderAtEnd).not.toStrictEqual(taskOrderAtStart)
        // expect the tasks of certain column to have the same
        // taskOrder the mutation was set to change it into
        expect(taskOrderAtEnd).toStrictEqual(newTaskOrderArray)
*/

/*
module.exports = {
    initializeDb,
    afterTests,
    boardsInTheDb,
    initialBoards,
    columnsOfBoardInTheDb,
    columnsInTheDb,
    storiesOfColumnInTheDb,
    storiesInTheDb,
    storyById,
    tasksOfColumnInTheDb,
    testCall,
    tasksInTheDb,
    taskById,
    getTaskOrderOfColumn,
    subtasksOfTaskInTheDb,
    subtasksInTheDb,
}
*/
