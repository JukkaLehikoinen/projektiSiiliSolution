import Project from "../src/models/Project";
import {
  findByProjectPk,
  mapProjectBoardsByProjectId,
  mapProjectByName,
  projectByName,
  afterTests,
  initializeDb,
  mapProjectById,
  boardsInTheDb,
  addBoardInTheDb,
  boardInTheDb,
  columnsOfBoardInTheDb,
} from "./sequelize-common";

/**
 * These tests will test the sql / ORM (Object-Relational-Mapping) layer through models
 */
describe("dummy project", () => {
  beforeAll(() => initializeDb());

  test("should be same as the model", async () => {
    const projects = await projectByName("SiiliWall");
    expect(projects.every((project) => project instanceof Project));
  });

  test("should have correct name", async () => {
    const project = await mapProjectByName("SiiliWall");
    expect(project).toEqual(["SiiliWall"]);
  });

  test("should have correct name when searching by primary key", async () => {
    const { name } = await findByProjectPk(
      "9da1b35f-181a-4397-a5a5-47abced10a66"
    );
    expect(name).toEqual("SiiliWall");
  });
  //Result comes in array. Is test correct?
  //test expect(id).toEqual(["9da1b35f-181a-4397-a5a5-47abced10a66"]);
  test("should return correct projectId", async () => {
    const id = await mapProjectById("9da1b35f-181a-4397-a5a5-47abced10a66");
    expect(id).toContain("9da1b35f-181a-4397-a5a5-47abced10a66");
  });

  //afterAll(() => afterTests());
});

describe("dummy board", () => {
  beforeAll(() => initializeDb());

  test("should return allBoards in the db", async () => {
    const boards = await boardsInTheDb();
    expect(boards).toHaveLength(4);
  });
  //bulkCreate creates createdAt and updatedAt which we don't know how to resolve it
  /*test("should add new board in the db", async () => {
    const newBoard = [
      {
        createdAt: "",
        id: "83fa4f89-8ea1-4d1c-9fee-321daa941486",
        prettyId: "TEST",
        name: "Testi taulu",
        creatorId: "6baba4dd-1ff4-4185-b8ff-1b735bc56576",
        orderNumber: 5,
        ticketCount: 0,
        projectId: "9da1b35f-181a-4397-a5a5-47abced10a66",
        updatedAt: "",
      },
    ];
    const board = await addBoardInTheDb(newBoard);
    expect(board).toEqual(newBoard);
  });
*/
  test("should have correct id when searching by primary key", async () => {
    const { id } = await boardInTheDb("83fa4f89-8ea1-4d1c-9fee-321daa941485");
    expect(id).toEqual("83fa4f89-8ea1-4d1c-9fee-321daa941485");
  });

  test("should return boards when searching by boardId", async () => {
    const id = await columnsOfBoardInTheDb([
      "83fa4f89-8ea1-4d1c-9fee-321daa941485",
    ]);
    expect(id).toHaveLength(4);
  });
  afterAll(() => afterTests());
});

/*
There are some issues in this test...
describe("dummy board", () => {
  beforeAll(() => initializeDb());

  test("should relate to project", async () => {
    const projectId = await mapProjectBoardsByProjectId(
      "83fa4f89-8ea1-4d1c-9fee-321daa941485"
    );
    console.log(projectId);
    expect(projectId).toEqual(["9da1b35f-181a-4397-a5a5-47abced10a66"]);
  });

  afterAll(() => afterTests());
});
*/
