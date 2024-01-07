import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { DynamodbConfigParams } from './dto/dynamodb.config.params';
import { DynamoDB } from '@aws-sdk/client-dynamodb';

class DynamodbConfig {
  public static getDynamoDBDocument(): DynamoDBDocument {
    // TODO: Move this to a config file
    const dynamoDBConfigParams: DynamodbConfigParams = {
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    };
    const dynamoDB = new DynamoDB(dynamoDBConfigParams);
    return DynamoDBDocument.from(dynamoDB);
  }
}

export default DynamodbConfig;
