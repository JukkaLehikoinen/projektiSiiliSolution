import express, {Application} from "express";
import {dbConfig} from "../database";
import boardsRouter from "../controllers/boards";
import {migrator} from "../migrations";
import {MigrationError} from "umzug";
const bodyParser = require('body-parser')
const env = process.env.NODE_ENV || 'development'

export const expressApp = (): express.Application => {
    dbConfig.authenticate().then(() => console.log("connected to db"))
        .catch(e => {
            throw e
        })

    if (env !== 'test') {
        migrator.up().then(() => console.log("Migrating db"))
            .catch((e: any) => {
                if (e instanceof MigrationError) {
                    console.log("Error while migrating", e.toString())
                }
                throw e
            })
    }

    const app: Application = express();
    if (env === "production") {
        app.use(require("helmet")());
        app.use(require("compression")());
        app.use('/health', require('express-healthcheck')())
    }
    app.use(require("cors")());
    app.use(bodyParser.json())

    app.use('/graphql', bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true, limit: "5m" }));

    app.use('/api/boards', boardsRouter)

    return app
};
