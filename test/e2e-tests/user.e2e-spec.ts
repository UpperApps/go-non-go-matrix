import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { User } from '../../src/domain/user/user';
import { UserRepository } from '../../src/domain/user/user.repository';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let user: User;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userRepository = testingModule.get<UserRepository>(UserRepository);

    user = {
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
    };

    app = testingModule.createNestApplication();

    await userRepository.save(user);

    await app.init();
  });

  afterEach(async () => {
    const users = await userRepository.findAll();

    for (const user of users) {
      await userRepository.delete(user.id);
    }
  });

  it('/users (GET) should return a list of users', async () => {
    const response = await request(app.getHttpServer()).get('/users');

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(1);
  });

  it('/users/:id (GET) should return 200 for an existent user', async () => {
    const response = await request(app.getHttpServer()).get(
      `/users/${user.id}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(user.id);
    expect(response.body.firstName).toEqual(user.firstName);
    expect(response.body.lastName).toEqual(user.lastName);
    expect(response.body.email).toEqual(user.email);
    expect(response.body.createdAt).toEqual(user.createdAt.toISOString());
    expect(response.body.updatedAt).toBeUndefined();
    expect(response.body.password).toBeUndefined();
  });

  it('/users/:id (GET) should return 404 for an non existent user', async () => {
    const response = await request(app.getHttpServer()).get('/users/1234');

    expect(response.status).toBe(404);
  });

  it('/users/:id (DELETE) should return 204 for an existent user', async () => {
    const spy = jest.spyOn(userRepository, 'delete');
    const response = await request(app.getHttpServer()).delete(
      `/users/${user.id}`,
    );

    expect(response.status).toBe(204);
    expect(spy).toHaveBeenCalledWith(user.id);
  });
});
