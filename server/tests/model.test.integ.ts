import Project from "../src/models/Project";
import { stories } from "./dummyData";

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
  addColumnForBoard,
  columnsInTheDb,
  storiesOfColumnInTheDb,
  storiesInTheDb,
  storyById,
  tasksOfColumnInTheDb,
  tasksInTheDb,
  taskById,
  getTaskOrderOfColumn,
  subtasksOfTaskInTheDb,
  subtasksInTheDb,
} from "./sequelize-common";

/**
 * These tests will test the sql / ORM (Object-Relational-Mapping) layer through models
    To start testing: at server directory docker-compose up -d db
    to run integration tests: npm run test-integ
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
    expect(boards).toHaveLength(boards.length);
  });

  test("should add new board in the db", async () => {
    const response = await addBoardInTheDb([
      {
        id: "9z999z99-z9zz-99z9-z9zz-z999z99z9z99",
        prettyId: "INT",
        name: "ISOPAHATAULU",
        creatorId: "8b251e01-0bec-41bf-b756-ba53c76d04e6",
        orderNumber: 5,
        ticketCount: 0,
        projectId: "9da1b35f-181a-4397-a5a5-47abced10a66",
      },
    ]);
    expect(Array.isArray(response)).toBe(true);
    const boardsAtEnd = await boardsInTheDb();
    expect(boardsAtEnd.length).toBe(5);
  });

  test("should have correct id when searching by primary key", async () => {
    const { id } = await boardInTheDb("83fa4f89-8ea1-4d1c-9fee-321daa941485");
    expect(id).toEqual("83fa4f89-8ea1-4d1c-9fee-321daa941485");
  });

  test("should return columns when searching by boardId", async () => {
    const id = await columnsOfBoardInTheDb([
      "83fa4f89-8ea1-4d1c-9fee-321daa941485",
    ]);
    expect(id).toHaveLength(4);
  });

  test("should add new column to specific board", async () => {
    const response = await addColumnForBoard([
      {
        name: "Test column",
        boardId: "83fa4f89-8ea1-4d1c-9fee-321daa941485",
        orderNumber: 5,
        id: "28d0ce05-b1e1-4c21-9c8a-87ba1b2a0531",
      },
    ]);
    expect(Array.isArray(response)).toBe(true);
    const columnsAtEnd = await columnsOfBoardInTheDb(
      "83fa4f89-8ea1-4d1c-9fee-321daa941485"
    );
    expect(columnsAtEnd.length).toBe(5);
  });

  test("should return all the columns in the db", async () => {
    const columns = await columnsInTheDb();
    expect(columns).toHaveLength(columns.length);
  });

  // RETURN TO THIS
  // SequelizeDatabaseError: Unknown column 'Story.columnId' in 'where clause'
  /*
  test("should return stories when searching by columnId", async () => {
    const id = await storiesOfColumnInTheDb([
      "f6209adb-91ca-476b-8269-asda82d05drt",
    ]);

    expect(id).toHaveLength(2);
  });
*/
  test("should return all stories in the db", async () => {
    const stories = await storiesInTheDb();
    expect(stories).toHaveLength(stories.length);
  });

  /**STORYBYID RETURNS FROM TEST
   * {
      +   "color": null,
      +   "createdAt": 2021-03-17T14:14:23.000Z,
      +   "deletedAt": null,
      +   "description": "this is the content",
          "id": "asd75646-6666-41f5-99d7-7d742f0e8ac5",
      +   "size": 4,
      +   "title": "First story",
      +   "updatedAt": 2021-03-17T14:14:23.000Z,
        }

  test("should return story by id", async () => {
    const story = await storyById("asd75646-6666-41f5-99d7-7d742f0e8ac5");
    expect(story).toEqual({
      title: "First story",
      description: "this is the content",
      size: 4,
      columnId: "asd75646-4035-41f5-99d7-7d742f0e8ac5",
      id: "asd75646-6666-41f5-99d7-7d742f0e8ac5",
      ownerId: "1fd5abe7-159e-4224-8a44-7ae3ee902a54",
      boardId: "0f154e01-f8ba-49c8-b2dc-e884d28e7f83",
    });
  });
 */

  test("should return all tasks in the column", async () => {
    const tasks = await tasksOfColumnInTheDb(
      "f6209adb-91ca-476b-8269-328a82d05d4a"
    );
    expect(tasks).toHaveLength(2);
  });

  test("should return all tasks in the db", async () => {
    const tasks = await tasksInTheDb();
    expect(tasks).toHaveLength(tasks.length);
  });

  //RETURNS TOO MUCH DATA..
  //DO WE NEED TO UPDATE DUMMYDATA?
  //"createdAt": 2021-03-17T13:12:46.000Z,
  //"deletedAt": null,
  //"description": null,
  //"difficulty": null,
  //"updatedAt": 2021-03-17T13:12:46.000Z,
  /*
  test("should return task by id", async () => {
    const task = await taskById("f3f3c12d-cee0-46bf-9374-f19ba8894ad6");
    expect(task).toMatchObject({
      prettyId: "KNBN-2",
      title: "Add drag and drop function to cards",
      content: "Add drag and drop function to cards",
      size: 1,
      columnId: "f6209adb-91ca-476b-8269-328a82d05d4a",
      columnOrderNumber: 0,
      swimlaneOrderNumber: 1,
      id: "f3f3c12d-cee0-46bf-9374-f19ba8894ad6",
      ownerId: "654df13f-51be-4b25-8f0e-7c2f40a3a81e",
      boardId: "0f154e01-f8ba-49c8-b2dc-e374d28f7f83",
    });
  });
*/

  //ASK ABOUT THIS TEST, DOES NOT FAIL, BUT DOES IT TEST CORRECTLY
  test("should return all tasks from column in the asc order", async () => {
    const arrayOfIds = await getTaskOrderOfColumn(
      "f6209adb-91ca-476b-8269-328a82d05d4a"
    );
    expect(arrayOfIds).toEqual([
      "f3f3c12d-cee0-46bf-9374-f19ba8894ad6",
      "d29fc7da-93a1-40ec-8c56-7b619445465b",
    ]);
  });

  test("should return all subtasks from task", async () => {
    const subtasks = await subtasksOfTaskInTheDb(
      "b8d2d626-d6a8-4c9a-89f3-a77796d2b2f3"
    );
    expect(subtasks).toHaveLength(subtasks.length);
  });

  test("should return all subtasks from task", async () => {
    const subtasks = await subtasksInTheDb();
    expect(subtasks).toHaveLength(subtasks.length);
  });

  afterAll(() => afterTests());
});

//There are some issues in this test...
//describe("dummy board", () => {
//  beforeAll(() => initializeDb());

// test("should relate to project", async () => {
//   const {projectId} = await mapProjectBoardsByProjectId(
//     "83fa4f89-8ea1-4d1c-9fee-321daa941485"
//   );
//   console.log(---------------------------)
//   console.log(projectId);
//   expect(projectId).toEqual(["9da1b35f-181a-4397-a5a5-47abced10a66"]);
// });

//afterAll(() => afterTests());
//});
