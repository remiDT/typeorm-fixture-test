import { FixtureLoader } from "./FixtureLoader";
import { MysqlCacheFixture } from "./cache/MysqlCacheFixture";
import { PostgresCacheFixture } from "./cache/PostgresCacheFixture";
import { getConnection } from "typeorm";
import { SqliteCacheFixture } from "./cache/SqliteCacheFixture";
import * as fs from "fs-extra";
import * as appRoot from "app-root-path";

const loadFixturesHelper = async (fixturesPath?: string): Promise<void> => {
  const fixtureLoader = new FixtureLoader();
  const databaseType = getConnection().options.type;

  if (!fixturesPath) {
    const fileContent = await fs.readFile(appRoot + "/fixture.config.json");
    const fixtureConfig = JSON.parse(fileContent.toString());
    fixturesPath = fixtureConfig.path as string;
  }

  switch (databaseType) {
    case "mysql":
    case "mariadb":
      return fixtureLoader.loadFixtures(fixturesPath, new MysqlCacheFixture());
    case "postgres":
      return fixtureLoader.loadFixtures(
        fixturesPath,
        new PostgresCacheFixture()
      );
    case "sqlite":
      return fixtureLoader.loadFixtures(fixturesPath, new SqliteCacheFixture());
    default:
      throw "Invalid database type. type must be mysql, mariadb, postgres or sqlite";
  }
};

export default loadFixturesHelper;
