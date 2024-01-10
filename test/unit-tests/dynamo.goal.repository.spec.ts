import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import { User } from '../../src/domain/user/user';
import { UserRepository } from '../../src/domain/user/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import DynamodbUserRepository from '../../src/infrastructure/repository/dynamodb.user.repository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from '../../src/infrastructure/config/dynamodb.config';
import { Goal } from '../../src/domain/goal/goal';
import { GoalRepository } from '../../src/domain/goal/goal.repository';

describe('Test Goal DynamoDB repository', () => {
  let user: User;
  let goal: Goal;
  let goalRepository: GoalRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DynamoDBDocument,
          useValue: DynamodbConfig.getDynamoDBDocument(),
        },
        {
          provide: GoalRepository,
          useClass: DynamodbUserRepository,
        },
      ],
    }).compile();

    goalRepository = testingModule.get<GoalRepository>(GoalRepository);
    userRepository = testingModule.get<UserRepository>(UserRepository);

    user = {
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
    };

    goal = {
      id: uuidv4(),
      userId: user.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      maxScore: faker.number.int(),
      createdAt: new Date(),
    };

    await userRepository.save(user);
  });

  afterEach(async () => {
    const users = await goalRepository.findAll();

    for (const user of users) {
      await goalRepository.delete(user.id);
    }

    await userRepository.delete(user.id);
  });

  it('should save a goal and find it by id', async () => {
    await goalRepository.save(goal);

    const savedGoal = await goalRepository.findById(goal.id);

    expect(savedGoal).toEqual(goal);
  });

  it('should update a goal', async () => {
    await goalRepository.save(goal);

    const savedUser = (await goalRepository.findById(goal.id)) as Goal;

    const goalToUpdate: Goal = {
      ...savedUser,
      name: 'Travolta',
    };

    await goalRepository.update(savedUser.id, goalToUpdate);

    const updatedGoal = await goalRepository.findById(savedUser.id);

    expect(updatedGoal?.name).toEqual('Travolta');
    expect(updatedGoal?.updatedAt).not.toBeNull();
  });

  it('should delete a goal', async () => {
    await goalRepository.save(goal);

    const savedGoal = await goalRepository.findById(goal.id);

    expect(savedGoal).not.toBeUndefined();

    await goalRepository.delete(goal.id);

    const deletedGoal = await goalRepository.findById(goal.id);

    expect(deletedGoal).toBeUndefined();
  });

  it('should find all goals', async () => {
    const anotherGoal: Goal = {
      id: uuidv4(),
      userId: uuidv4(),
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      maxScore: faker.number.int(),
      createdAt: new Date(),
    };

    await goalRepository.save(goal);
    await goalRepository.save(anotherGoal);

    const goals = await goalRepository.findAll();

    expect(goals.length).toEqual(2);
  });
});
