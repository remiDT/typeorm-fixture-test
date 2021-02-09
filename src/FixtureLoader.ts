import * as path from "path";
import {
  Builder,
  fixturesIterator,
  IFixture,
  Loader,
  Parser,
  Resolver,
} from "typeorm-fixtures-cli/dist";
import { getConnection, getRepository } from "typeorm";
import { hashElement } from "folder-hash";
import * as fs from "fs-extra";
import { DatabaseCacheFixtureInterface } from "./cache/DatabaseCacheFixtureInterface";
import * as appRoot from "app-root-path";
import * as mkdirp from "mkdirp";

const ROOT_TMP = appRoot + "/tmp";
const FIXTURE_HASH_PATH = appRoot + "/tmp/fixturesHash";

export class FixtureLoader {
  loadFixtures = async (
    fixturesPaths: string,
    dataBaseCache: DatabaseCacheFixtureInterface
  ) => {
    const hashFixtures = await this.genHash(fixturesPaths);
    if (this.isSameHash(hashFixtures)) {
      await dataBaseCache.purgeData();
      await dataBaseCache.insertData();
      return;
    }

    await this.generateCache(fixturesPaths, dataBaseCache);
    await this.saveHashFixtures(hashFixtures);
  };

  private generateCache = async (
    fixturesPaths: string,
    dataBaseCache: DatabaseCacheFixtureInterface
  ): Promise<void> => {
    this.createTmpDir();

    await getConnection().synchronize(true);

    const loader = new Loader();
    loader.load(path.resolve(fixturesPaths));

    const resolver = new Resolver();
    const fixtures = resolver.resolve(loader.fixtureConfigs);

    await this.saveFixturesInDatabase(fixtures);

    await dataBaseCache.createBackupDataFile();
    await dataBaseCache.createPurgeDataFile();
  };

  private saveFixturesInDatabase = async (
    fixtures: IFixture[]
  ): Promise<void> => {
    const builder = new Builder(getConnection(), new Parser());

    for (const fixture of fixturesIterator(fixtures)) {
      const entity = await builder.build(fixture);
      await getRepository(entity.constructor.name).save(entity);
    }
  };

  private isSameHash = (hashFixturesDir: any): boolean => {
    if (!fs.existsSync(FIXTURE_HASH_PATH)) {
      return false;
    }
    return hashFixturesDir == fs.readFileSync(FIXTURE_HASH_PATH).toString();
  };

  private createTmpDir = (): void => {
    mkdirp.sync(ROOT_TMP);
  };

  private genHash = async (fixturesPaths: string): Promise<string> => {
    const hashDir = await hashElement(fixturesPaths, {});
    return getConnection().options.type + hashDir.hash;
  };

  private saveHashFixtures = async (hashFixtures: string) => {
    await fs.writeFile(FIXTURE_HASH_PATH, hashFixtures);
  };
}
