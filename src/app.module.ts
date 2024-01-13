import { Module } from '@nestjs/common';
import DynamodbUserRepository from './infrastructure/repository/dynamodb.user.repository';
import { UserRepository } from './domain/user/user.repository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from './infrastructure/config/dynamodb.config';
import { UserController } from './presentation/user.controller';
import { GoalRepository } from './domain/goal/goal.repository';
import { DynamodbGoalRepository } from './infrastructure/repository/dynamodb.goal.repository';
import { GoalController } from './presentation/goal.controller';
import { DynamodbCriteriaRepository } from './infrastructure/repository/dynamodb.criteria.repository';
import { CriteriaRepository } from './domain/criteria/criteria.repository';

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

const criteriaRepositoryProvider = {
  provide: CriteriaRepository,
  useClass: DynamodbCriteriaRepository,
};

@Module({
  controllers: [UserController, GoalController],
  providers: [
    dynamoDBDocumentProvider,
    userRepositoryProvider,
    goalRepositoryProvider,
    criteriaRepositoryProvider,
  ],
})
export class AppModule {}
