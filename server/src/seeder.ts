import {dbConfig as sequelize} from './database';
import {SequelizeStorage, Umzug} from "umzug";

export const seeders = new Umzug({
  migrations: {
    glob: ['seeders/*.ts', { cwd: __dirname }],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
})

export type Seeders = typeof seeders._types.migration;
