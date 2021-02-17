import {dbConfig as sequelize} from '../database';
import {SequelizeStorage, Umzug} from "umzug";

export const migrator = new Umzug({
  migrations: {
    glob: ['../migrations/*.ts', { cwd: __dirname }],
  },
  context: sequelize,
  storage: new SequelizeStorage({
    sequelize,
  }),
  logger: console,
})

export type Migration = typeof migrator._types.migration;
