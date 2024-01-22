import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { Goal } from '../../src/domain/goal/goal';
import { GoalRepository } from '../../src/domain/goal/goal.repository';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';

jest.mock('../../src/domain/goal/goal.service', () => {
  return {
    GoalService: jest.fn().mockImplementation(() => {
      return {
        save: () => {}
      };
    })
  };
});

describe('GoalController (e2e)', () => {
  let app: INestApplication;
  let goal: Goal;
  let goalRepository: GoalRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    goalRepository = testingModule.get<GoalRepository>(GoalRepository);

    goal = {
      id: uuidv4(),
      userId: uuidv4(),
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(10),
      maxScore: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date()
    };

    app = testingModule.createNestApplication();

    await goalRepository.save(goal);

    await app.init();
  });

  afterEach(async () => {
    const goals = await goalRepository.findAll(goal.userId);

    for (const goal of goals) {
      await goalRepository.delete(goal.id, goal.userId);
    }

    jest.clearAllMocks();
  });

  it('/users/userId/goals (GET) should return a list of goals', async () => {
    const response = await request(app.getHttpServer()).get(`/users/${goal.userId}/goals`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it('/users/:userId/goals/:id (GET) should return 200 for an existent goal', async () => {
    const response = await request(app.getHttpServer()).get(`/users/${goal.userId}/goals/${goal.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(goal.id);
    expect(response.body.userId).toEqual(goal.userId);
    expect(response.body.name).toEqual(goal.name);
    expect(response.body.description).toEqual(goal.description);
    expect(response.body.maxScore).toEqual(goal.maxScore);
    expect(response.body.createdAt).toEqual(goal.createdAt.toISOString());
    expect(response.body.updatedAt).toBeUndefined();
  });

  it('/users/:userId/goals/:id (GET) should return 404 for an non existent goal', async () => {
    const response = await request(app.getHttpServer()).get(`/users/${goal.userId}/goals/1234`);

    expect(response.status).toBe(404);
  });

  it('/users/:userId/goals/:id (DELETE) should return 204 for an existent goal', async () => {
    const spy = jest.spyOn(goalRepository, 'delete');
    const response = await request(app.getHttpServer()).delete(`/users/${goal.userId}/goals/${goal.id}`);

    expect(response.status).toBe(204);
    expect(spy).toHaveBeenCalledWith(goal.id, goal.userId);
  });

  it('/users/:userId/goals (POST) should return 201 for a valid goal', async () => {
    const response = await request(app.getHttpServer())
      .post(`/users/${goal.userId}/goals`)
      .send({
        ...goal,
        id: undefined
      });

    expect(response.status).toBe(201);
  });

  it('/users/:userId/goals/:id (PUT) should return 200 for an existent goal', async () => {
    const spy = jest.spyOn(goalRepository, 'update');
    const response = await request(app.getHttpServer()).put(`/users/${goal.userId}/goals/${goal.id}`).send({
      name: 'Lero lero',
      description: 'Lero lero',
      maxScore: 10
    });

    expect(response.status).toBe(204);
    expect(spy).toHaveBeenCalled();

    const updatedGoal = await goalRepository.findById(goal.id, goal.userId);
    expect(updatedGoal.name).toEqual('Lero lero');
    expect(updatedGoal.description).toEqual('Lero lero');
    expect(updatedGoal.maxScore).toEqual(10);
  });
});
