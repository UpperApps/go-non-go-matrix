import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import { User } from '../../src/domain/user/user';
import { UserRepository } from '../../src/domain/user/user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import DynamodbUserRepository from '../../src/infrastructure/repository/dynamodb.user.repository';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from '../../src/infrastructure/config/dynamodb.config';

describe('Test User DynamoDB repository', () => {
  let user: User;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DynamoDBDocument,
          useValue: DynamodbConfig.getDynamoDBDocument(),
        },
        {
          provide: UserRepository,
          useClass: DynamodbUserRepository,
        },
      ],
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
  });

  afterEach(async () => {
    const users = await userRepository.findAll();

    for (const user of users) {
      await userRepository.delete(user.id);
    }
  });

  it('should save a user and find it by id', async () => {
    await userRepository.save(user);

    const savedUser = await userRepository.findById(user.id);

    expect(savedUser).toEqual(user);
  });

  it('should update a user', async () => {
    await userRepository.save(user);

    const savedUser = (await userRepository.findById(user.id)) as User;

    const userToUpdate: User = {
      ...savedUser,
      lastName: 'Travolta',
    };

    await userRepository.update(savedUser.id, userToUpdate);

    const updatedUser = await userRepository.findById(savedUser.id);

    expect(updatedUser?.lastName).toEqual('Travolta');
    expect(updatedUser?.updatedAt).not.toBeNull();
  });

  it('should delete a user', async () => {
    await userRepository.save(user);

    const savedUser = await userRepository.findById(user.id);

    expect(savedUser).not.toBeUndefined();

    await userRepository.delete(user.id);

    const deletedUser = await userRepository.findById(user.id);

    expect(deletedUser).toBeUndefined();
  });

  it('should find all users', async () => {
    const anotherUser: User = {
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
    };

    await userRepository.save(user);
    await userRepository.save(anotherUser);

    const users = await userRepository.findAll();

    expect(users.length).toEqual(2);
  });
});
