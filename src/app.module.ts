import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import DynamodbUserRepository from './infrastructure/repository/dynamodb.user.repository';
import { UserRepository } from './domain/user/user.repository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from './infrastructure/config/dynamodb.config';

const userRepositoryProvider = {
  provide: UserRepository,
  useClass: DynamodbUserRepository,
};

const dynamoDBDocumentProvider = {
  provide: DynamoDBDocument,
  useValue: DynamodbConfig.getDynamoDBDocument(),
};

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, userRepositoryProvider, dynamoDBDocumentProvider],
})
export class AppModule {}
