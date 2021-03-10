import Project from "../src/models/Project";
import Board from "../src/models/Board";

//TODO Move all Sequelize stuff from utils.ts to this file
export const projectByName = async (name: string) => {
    return await Project.findAll(
        {
            where: {
                name: name
            }
        });
}

export const mapProjectByName = async (name: string) => {
    return (await Project.findAll(
        {
            where: {
                name: name
            }
        })).map(project => project.get("name"))
}

export const mapProjectById = async (id: string) => {
    return (await Project.findAll(
        {
            where: {
                id: id
            }
        })).map(project => project.get("id"));
}

export const mapProjectBoardsByProjectId = async (id: string) => {
    return (await Board.findAll(
        {
            where: {
                id: id
            }
        }
    )).map(board => board.get("projectId"));
}

export const findByProjectPk = async (id: string) => {
    return (await Project.findByPk(id))
}
