export interface DatabaseCacheFixtureInterface {
  createBackupDataFile(): Promise<void>;

  createPurgeDataFile(): Promise<void>;

  purgeData(): Promise<void>;

  insertData(): Promise<void>;
}
