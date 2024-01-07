import type { DatabaseConfigParams } from './database.config.params';

export type DynamodbConnection = {
  constructor: (dBConfigParams: DatabaseConfigParams) => void;
  connect(): void;
};
