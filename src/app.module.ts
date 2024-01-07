import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DynamoUserRepository from './infrastructure/DynamoUserRepository';
import { UserRepository } from './domain/user/UserRepository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamoDBConfig from './infrastructure/config/DynamoDBConfig';

const userRepositoryProvider = {
  provide: UserRepository,
  useClass: DynamoUserRepository,
};

const dynamoDBDocumentProvider = {
  provide: DynamoDBDocument,
  useValue: DynamoDBConfig.getDynamoDBDocument(),
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, userRepositoryProvider, dynamoDBDocumentProvider],
})
export class AppModule {}
