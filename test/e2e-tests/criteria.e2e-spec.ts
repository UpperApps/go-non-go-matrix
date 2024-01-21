import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import * as request from 'supertest';
import { CriteriaRepository } from '../../src/domain/criteria/criteria.repository';
import { Criteria } from '../../src/domain/criteria/criteria';

describe('CriteriaController (e2e)', () => {
  let app: INestApplication;
  let criteria: Criteria;
  let criteriaRepository: CriteriaRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    criteriaRepository = testingModule.get<CriteriaRepository>(CriteriaRepository);

    criteria = {
      id: uuidv4(),
      goalId: uuidv4(),
      description: faker.lorem.sentence(10),
      weight: faker.number.int({ min: 0, max: 10 }),
      createdAt: new Date()
    };

    app = testingModule.createNestApplication();

    await criteriaRepository.save(criteria);

    await app.init();
  });

  afterEach(async () => {
    const criteriaList = await criteriaRepository.findAll(criteria.goalId);

    for (const criterion of criteriaList) {
      await criteriaRepository.delete(criterion.id, criterion.goalId);
    }
  });

  it('/users/:userId/goals/:goalId/criteria (GET) should return a list of criteria', async () => {
    const response = await request(app.getHttpServer()).get(`/users/123/goals/${criteria.goalId}/criteria`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it('/users/:userId/goals/:goalId/criteria/:id (GET) should return 200 for an existent criteria', async () => {
    const response = await request(app.getHttpServer()).get(
      `/users/123/goals/${criteria.goalId}/criteria/${criteria.id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(criteria.id);
    expect(response.body.goalId).toEqual(criteria.goalId);
    expect(response.body.description).toEqual(criteria.description);
    expect(response.body.weight).toEqual(criteria.weight);
    expect(response.body.createdAt).toEqual(criteria.createdAt.toISOString());
    expect(response.body.updatedAt).toBeUndefined();
  });

  it('/users/:userId/goals/:id (GET) should return 404 for an non existent criteria', async () => {
    const response = await request(app.getHttpServer()).get(`/users/123/goals/${criteria.goalId}/criteria/1234`);

    expect(response.status).toBe(404);
  });

  it('/users/:userId/goals/:id (DELETE) should return 204 for an existent criteria', async () => {
    const spy = jest.spyOn(criteriaRepository, 'delete');
    const response = await request(app.getHttpServer()).delete(
      `/users/123/goals/${criteria.goalId}/criteria/${criteria.id}`
    );

    expect(response.status).toBe(204);
    expect(spy).toHaveBeenCalledWith(criteria.id, criteria.goalId);
  });

  it('/users/:userId/goals/:goalId/criteria (POST) should return 201 for a valid criteria', async () => {
    const spy = jest.spyOn(criteriaRepository, 'save');
    const response = await request(app.getHttpServer())
      .post(`/users/123/goals/${criteria.goalId}/criteria`)
      .send({
        ...criteria,
        id: undefined
      });

    expect(response.status).toBe(201);
    expect(spy).toHaveBeenCalled();
  });

  it('/users/:userId/goals/:goalId/criteria/:id (PUT) should return 200 for an existent goal', async () => {
    const spy = jest.spyOn(criteriaRepository, 'update');
    const response = await request(app.getHttpServer())
      .put(`/users/123/goals/${criteria.goalId}/criteria/${criteria.id}`)
      .send({
        description: 'Lero lero',
        weight: 10
      });

    expect(response.status).toBe(204);
    expect(spy).toHaveBeenCalled();

    const updatedGoal = await criteriaRepository.findById(criteria.id, criteria.goalId);
    expect(updatedGoal.description).toEqual('Lero lero');
    expect(updatedGoal.weight).toEqual(10);
  });
});
