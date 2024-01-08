import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DynamodbUserRepository from './infrastructure/repository/dynamodb.user.repository';
import { UserRepository } from './domain/user/user.repository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from './infrastructure/config/dynamodb.config';
import { UserController } from './domain/user/user.controller';

const dynamoDBDocumentProvider = {
  provide: DynamoDBDocument,
  useValue: DynamodbConfig.getDynamoDBDocument(),
};

const userRepositoryProvider = {
  provide: UserRepository,
  useClass: DynamodbUserRepository,
};

@Module({
  controllers: [AppController, UserController],
  providers: [AppService, dynamoDBDocumentProvider, userRepositoryProvider],
})
export class AppModule {}
