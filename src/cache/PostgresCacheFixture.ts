import * as fs from "fs";
import { exec } from "child_process";
import { DatabaseCacheFixtureInterface } from "./DatabaseCacheFixtureInterface";
import { getConnection, getManager } from "typeorm";
import * as replace from "replace-in-file";
import * as appRoot from "app-root-path";

const DATA_PATH = appRoot + "/tmp/data.sql";
const DELETE_PATH = appRoot + "/tmp/delete.sql";

export class PostgresCacheFixture implements DatabaseCacheFixtureInterface {
  private conn: any;

  constructor() {
    this.conn = getConnection().options;
  }

  createBackupDataFile = async (): Promise<void> => {
    const pgDumpFn = `pg_dump --dbname=postgresql://${this.conn.username}:${this.conn.password}@${this.conn.host}:${this.conn.port}/${this.conn.database} --insert --data-only --file "${DATA_PATH}"  &>/dev/null`;
    await this.runCommand(pgDumpFn);
    await this.removeSearchPath(DATA_PATH);
  };

  createPurgeDataFile = async (): Promise<void> => {
    const writer = fs.createWriteStream(DELETE_PATH, {
      flags: "w",
    });

    writer.write("SET session_replication_role = replica;\n");
    getConnection().entityMetadatas.forEach((entity) => {
      writer.write(`delete from "${entity.tableName}"; \n`);
    });
    writer.write("SET session_replication_role = DEFAULT;");
    writer.close();
  };

  purgeData = async (): Promise<void> => {
    const manager = getManager();
    const sql = fs.readFileSync(DELETE_PATH).toString();
    await manager.query(sql);
  };

  insertData = async (): Promise<void> => {
    const manager = getManager();
    const sql = fs.readFileSync(DATA_PATH).toString();
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

  private async removeSearchPath(filePath: string) {
    await replace.replaceInFile({
      files: filePath,
      from: "SELECT pg_catalog.set_config('search_path', '', false);",
      to: "",
    });
  }
}
