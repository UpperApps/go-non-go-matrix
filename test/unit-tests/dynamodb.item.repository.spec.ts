import { Goal } from '../../src/domain/goal/goal';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from '../../src/infrastructure/config/dynamodb.config';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import { Item } from '../../src/domain/item/item';
import { ItemRepository } from '../../src/domain/item/item.repository';
import { DynamodbItemRepository } from '../../src/infrastructure/repository/dynamodb.item.repository';

describe('Test Item DynamoDB repository', () => {
  let goal: Goal;
  let item: Item;
  let itemRepository: ItemRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DynamoDBDocument,
          useValue: DynamodbConfig.getDynamoDBDocument()
        },
        {
          provide: ItemRepository,
          useClass: DynamodbItemRepository
        }
      ]
    }).compile();

    itemRepository = testingModule.get<ItemRepository>(ItemRepository);

    goal = {
      id: uuidv4(),
      userId: uuidv4(),
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      maxScore: faker.number.int({ min: 5, max: 10 }),
      createdAt: new Date()
    };

    item = {
      id: uuidv4(),
      goalId: goal.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: new Date()
    };
  });

  afterEach(async () => {
    const items = await itemRepository.findAll(goal.id);

    for (const item of items) {
      await itemRepository.delete(item.id, item.goalId);
    }
  });

  it('should save an item and find it by id', async () => {
    await itemRepository.save({ ...item, updatedAt: undefined });

    const savedItem = await itemRepository.findById(item.id, item.goalId);

    expect(savedItem).toEqual(item);
  });

  it('should update an item', async () => {
    await itemRepository.save(item);

    const savedItem = (await itemRepository.findById(item.id, item.goalId)) as Item;

    const itemToUpdate: Item = {
      ...savedItem,
      description: 'My item, my rules'
    };

    await itemRepository.update(itemToUpdate);

    const updatedItem = await itemRepository.findById(savedItem.id, savedItem.goalId);

    expect(updatedItem?.description).toEqual('My item, my rules');
    expect(updatedItem?.updatedAt).not.toBeNull();
  });

  it('should delete an item', async () => {
    await itemRepository.save(item);

    const savedItem = await itemRepository.findById(item.id, item.goalId);

    expect(savedItem).not.toBeUndefined();

    await itemRepository.delete(item.id, item.goalId);

    const deletedItem = await itemRepository.findById(item.id, item.goalId);

    expect(deletedItem).toBeUndefined();
  });

  it('should find all items', async () => {
    const anotherItem: Item = {
      id: uuidv4(),
      goalId: goal.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      createdAt: new Date()
    };

    await itemRepository.save(item);
    await itemRepository.save(anotherItem);

    const goals = await itemRepository.findAll(goal.id);

    expect(goals.length).toEqual(2);
  });
});
