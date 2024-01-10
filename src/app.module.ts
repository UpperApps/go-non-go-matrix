import { Module } from '@nestjs/common';
import DynamodbUserRepository from './infrastructure/repository/dynamodb.user.repository';
import { UserRepository } from './domain/user/user.repository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from './infrastructure/config/dynamodb.config';
import { UserController } from './presentation/user.controller';
import { GoalRepository } from './domain/goal/goal.repository';
import { DynamodbGoalRepository } from './infrastructure/repository/dynamodb.goal.repository';

const dynamoDBDocumentProvider = {
  provide: DynamoDBDocument,
  useValue: DynamodbConfig.getDynamoDBDocument(),
};

const userRepositoryProvider = {
  provide: UserRepository,
  useClass: DynamodbUserRepository,
};

const goalRepositoryProvider = {
  provide: GoalRepository,
  useClass: DynamodbGoalRepository,
};

@Module({
  controllers: [UserController],
  providers: [
    dynamoDBDocumentProvider,
    userRepositoryProvider,
    goalRepositoryProvider,
  ],
})
export class AppModule {}
