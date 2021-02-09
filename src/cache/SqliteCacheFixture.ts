import { DatabaseCacheFixtureInterface } from "./DatabaseCacheFixtureInterface";
import * as fs from "fs-extra";
import { getConnection } from "typeorm";
import * as appRoot from "app-root-path";

const DATABASE_FILE_BACKUP = appRoot + "/tmp/sqliteBackup.db";

export class SqliteCacheFixture implements DatabaseCacheFixtureInterface {
  readonly database: string;

  constructor() {
    this.database = getConnection().options.database as string;
  }

  createPurgeDataFile = async (): Promise<void> => {
    //Nothing to do.
    return Promise.resolve(undefined);
  };

  createBackupDataFile = async (): Promise<void> => {
    return await fs.copyFile(this.database, DATABASE_FILE_BACKUP);
  };

  insertData = async (): Promise<void> => {
    return await fs.copyFile(DATABASE_FILE_BACKUP, this.database);
  };

  purgeData = async (): Promise<void> => {
    // Nothing to do
    return Promise.resolve(undefined);
  };
}
