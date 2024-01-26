import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import { User } from '../../src/domain/user/user';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from '../../src/infrastructure/config/dynamodb.config';
import { Goal } from '../../src/domain/goal/goal';
import { GoalRepository } from '../../src/domain/goal/goal.repository';
import { DynamodbGoalRepository } from '../../src/infrastructure/repository/dynamodb.goal.repository';

describe('Test Goal DynamoDB repository', () => {
  let user: User;
  let goal: Goal;
  let goalRepository: GoalRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DynamoDBDocument,
          useValue: DynamodbConfig.getDynamoDBDocument()
        },
        {
          provide: GoalRepository,
          useClass: DynamodbGoalRepository
        }
      ]
    }).compile();

    goalRepository = testingModule.get<GoalRepository>(GoalRepository);

    user = {
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date()
    };

    goal = {
      id: uuidv4(),
      userId: user.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      maxScore: faker.number.int({ min: 5, max: 10 }),
      createdAt: new Date()
    };
  });

  afterEach(async () => {
    const goals = await goalRepository.findAll(user.id);

    for (const goal of goals) {
      await goalRepository.delete(goal.id, goal.userId);
    }
  });

  it('should save a goal and find it by id', async () => {
    await goalRepository.save(goal);

    const savedGoal = await goalRepository.findById(goal.id, goal.userId);

    expect(savedGoal).toEqual(goal);
  });

  it('should update a goal', async () => {
    await goalRepository.save(goal);

    const savedGoal = (await goalRepository.findById(goal.id, goal.userId)) as Goal;

    const goalToUpdate: Goal = {
      ...savedGoal,
      name: 'Goals 2024'
    };

    await goalRepository.update(goalToUpdate);

    const updatedGoal = await goalRepository.findById(savedGoal.id, savedGoal.userId);

    expect(updatedGoal?.name).toEqual('Goals 2024');
    expect(updatedGoal?.updatedAt).not.toBeNull();
  });

  it('should delete a goal', async () => {
    await goalRepository.save(goal);

    const savedGoal = await goalRepository.findById(goal.id, goal.userId);

    expect(savedGoal).not.toBeUndefined();

    await goalRepository.delete(goal.id, goal.userId);

    const deletedGoal = await goalRepository.findById(goal.id, goal.userId);

    expect(deletedGoal).toBeUndefined();
  });

  it('should find all goals', async () => {
    const anotherGoal: Goal = {
      id: uuidv4(),
      userId: user.id,
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      maxScore: faker.number.int(),
      createdAt: new Date()
    };

    await goalRepository.save(goal);
    await goalRepository.save(anotherGoal);

    const goals = await goalRepository.findAll(user.id);

    expect(goals.length).toEqual(2);
  });
});
