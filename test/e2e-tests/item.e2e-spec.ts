import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import * as request from 'supertest';
import { Item } from '../../src/domain/item/item';
import { ItemRepository } from '../../src/domain/item/item.repository';

jest.mock('../../src/domain/item/item.service', () => {
  return {
    ItemService: jest.fn().mockImplementation(() => {
      return {
        save: () => {}
      };
    })
  };
});

describe('ItemController (e2e)', () => {
  let app: INestApplication;
  let item: Item;
  let itemRepository: ItemRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    itemRepository = testingModule.get<ItemRepository>(ItemRepository);

    item = {
      id: uuidv4(),
      goalId: uuidv4(),
      name: faker.lorem.word(3),
      description: faker.lorem.sentence(10),
      createdAt: new Date()
    };

    app = testingModule.createNestApplication();

    await itemRepository.save(item);

    await app.init();
  });

  afterEach(async () => {
    const items = await itemRepository.findAll(item.goalId);

    for (const item of items) {
      await itemRepository.delete(item.id, item.goalId);
    }

    jest.clearAllMocks();
  });

  it('/users/:userId/goals/:goalId/items (GET) should return a list of items', async () => {
    const response = await request(app.getHttpServer()).get(`/users/123/goals/${item.goalId}/items`);

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it('/users/:userId/goals/:goalId/items/:id (GET) should return 200 for an existent item', async () => {
    const response = await request(app.getHttpServer()).get(`/users/123/goals/${item.goalId}/items/${item.id}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(item.id);
    expect(response.body.goalId).toEqual(item.goalId);
    expect(response.body.name).toEqual(item.name);
    expect(response.body.description).toEqual(item.description);
    expect(response.body.createdAt).toEqual(item.createdAt.toISOString());
    expect(response.body.updatedAt).toBeUndefined();
  });

  it('/users/:userId/goals/:goalId/items/:id (GET) should return 404 for an non existent item', async () => {
    const response = await request(app.getHttpServer()).get(`/users/123/goals/${item.goalId}/items/1234`);

    expect(response.status).toBe(404);
  });

  it('/users/:userId/goals/:goalId/items/:id (DELETE) should return 204 for an existent item', async () => {
    const spy = jest.spyOn(itemRepository, 'delete');
    const response = await request(app.getHttpServer()).delete(`/users/123/goals/${item.goalId}/items/${item.id}`);

    expect(response.status).toBe(204);
    expect(spy).toHaveBeenCalledWith(item.id, item.goalId);
  });

  it('/users/:userId/goals/:goalId/items (POST) should return 201 for a valid item', async () => {
    const response = await request(app.getHttpServer())
      .post(`/users/123/goals/${item.goalId}/items`)
      .send({
        ...item,
        id: undefined
      });

    expect(response.status).toBe(201);
  });

  it('/users/:userId/goals/:goalId/items/:id (PUT) should return 200 for an existent item', async () => {
    const spy = jest.spyOn(itemRepository, 'update');
    const response = await request(app.getHttpServer()).put(`/users/123/goals/${item.goalId}/items/${item.id}`).send({
      name: 'bla bla bla',
      description: 'Lero lero'
    });

    expect(response.status).toBe(204);
    expect(spy).toHaveBeenCalled();

    const updatedGoal = await itemRepository.findById(item.id, item.goalId);
    expect(updatedGoal.name).toEqual('bla bla bla');
    expect(updatedGoal.description).toEqual('Lero lero');
  });
});
