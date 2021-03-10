import {afterTests, initializeDb} from "./utils";
import Project from "../src/models/Project";
import {
    findByProjectPk,
    mapProjectBoardsByProjectId,
    mapProjectByName,
    projectByName
} from "./sequelize-common";

/**
 * These tests will test the sql / ORM (Object-Relational-Mapping) layer through models
 */
describe("dummy project", () => {
    beforeAll(() => initializeDb())

    test("should be same as the model", async () => {
        const projects = await projectByName("SiiliWall")
        expect(projects.every(project => project instanceof Project))
    })

    test("should have correct name",  async () => {
        const project = await mapProjectByName("SiiliWall")
        expect(project).toEqual(["SiiliWall"])
    })

    test("should have correct name when searching by primary key",  async () => {
        const { name } = await findByProjectPk("9da1b35f-181a-4397-a5a5-47abced10a66")
        expect(name).toEqual("SiiliWall")
    })


    afterAll(() => afterTests())
})

describe("dummy board", () => {
    beforeAll(() => initializeDb())

    test("should relate to project",  async () => {
        const projectId = await mapProjectBoardsByProjectId("83fa4f89-8ea1-4d1c-9fee-321daa941485")
        console.log(projectId)
        expect(projectId).toEqual(["9da1b35f-181a-4397-a5a5-47abced10a66"])
    })

    afterAll(() => afterTests())
})

