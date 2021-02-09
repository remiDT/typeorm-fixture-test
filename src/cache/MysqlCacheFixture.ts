import { DatabaseCacheFixtureInterface } from "./DatabaseCacheFixtureInterface";
import * as fs from "fs-extra";
import { exec } from "child_process";
import * as appRoot from "app-root-path";
import { getConnection, getManager } from "typeorm";
import * as prependFile from "prepend-file";

const DATA_PATH = appRoot + "/tmp/data.sql";
const DELETE_PATH = appRoot + "/tmp/delete.sql";

export class MysqlCacheFixture implements DatabaseCacheFixtureInterface {
  private conn: any;

  constructor() {
    this.conn = getConnection().options;
  }

  createPurgeDataFile = async (): Promise<void> => {
    const writer = fs.createWriteStream(DELETE_PATH, {
      flags: "w",
    });

    writer.write("SET FOREIGN_KEY_CHECKS = 0; \n");
    getConnection().entityMetadatas.forEach((entity) => {
      writer.write(`delete from ${entity.tableName}; \n`);
    });
    writer.write("SET FOREIGN_KEY_CHECKS = 1;");
    writer.close();
  };

  createBackupDataFile = async (): Promise<void> => {
    const mysqlDumFn = `mysqldump --host ${this.conn.host} -P ${this.conn.port} --password=${this.conn.password} --user ${this.conn.username} --no-create-info --skip-triggers --no-create-db --no-tablespaces --compact ${this.conn.database} > ${DATA_PATH}`;
    await this.runCommand(mysqlDumFn);
    await prependFile(DATA_PATH, "SET FOREIGN_KEY_CHECKS = 0;\n");
    await fs.appendFile(DATA_PATH, "SET FOREIGN_KEY_CHECKS = 1;\n");
  };

  insertData = async (): Promise<void> => {
    const manager = getManager();
    const sql = fs.readFileSync(DATA_PATH).toString();
    return await manager.query(sql);
  };

  purgeData = async (): Promise<void> => {
    const manager = getManager();
    const sql = fs.readFileSync(DELETE_PATH).toString();
    return await manager.query(sql);
  };

  private runCommand = (cmd: string) => {
    return new Promise<void>((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(error);
        resolve(undefined);
      });
    });
  };
}
