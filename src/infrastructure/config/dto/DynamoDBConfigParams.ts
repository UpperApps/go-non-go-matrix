import type { DBConfigParams } from '../../../domain/config/DBConfigParams';

export type DynamoDBConfigParams = DBConfigParams & {
  region: string;
  endpoint: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};
