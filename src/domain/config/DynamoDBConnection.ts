import type { DBConfigParams } from './DBConfigParams';

export type DynamoDBConnection = {
  constructor: (dBConfigParams: DBConfigParams) => void;
  connect(): void;
};
