import type { DatabaseConfigParams } from '../../../domain/config/database.config.params';

export type DynamodbConfigParams = DatabaseConfigParams & {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};
