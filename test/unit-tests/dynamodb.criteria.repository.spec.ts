import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import DynamodbConfig from '../../src/infrastructure/config/dynamodb.config';
import { Goal } from '../../src/domain/goal/goal';
import { Criteria } from '../../src/domain/criteria/criteria';
import { CriteriaRepository } from '../../src/domain/criteria/criteria.repository';
import { DynamodbCriteriaRepository } from '../../src/infrastructure/repository/dynamodb.criteria.repository';

describe('Test Criteria DynamoDB repository', () => {
  let goal: Goal;
  let criteria: Criteria;
  let criteriaRepository: CriteriaRepository;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: DynamoDBDocument,
          useValue: DynamodbConfig.getDynamoDBDocument()
        },
        {
          provide: CriteriaRepository,
          useClass: DynamodbCriteriaRepository
        }
      ]
    }).compile();

    criteriaRepository = testingModule.get<CriteriaRepository>(CriteriaRepository);

    goal = {
      id: uuidv4(),
      userId: uuidv4(),
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      maxScore: faker.number.int({ min: 5, max: 10 }),
      createdAt: new Date()
    };

    criteria = {
      id: uuidv4(),
      goalId: goal.id,
      description: faker.lorem.sentence(),
      weight: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date()
    };
  });

  afterEach(async () => {
    const criteria = await criteriaRepository.findAll(goal.id);

    for (const criterion of criteria) {
      await criteriaRepository.delete(criterion.id, criterion.goalId);
    }
  });

  it('should save a criteria and find it by id', async () => {
    await criteriaRepository.save({ ...criteria, updatedAt: undefined });

    const savedCriteria = await criteriaRepository.findById(criteria.id, criteria.goalId);

    expect(savedCriteria).toEqual(criteria);
  });

  it('should update a criteria', async () => {
    await criteriaRepository.save(criteria);

    const savedCriteria = (await criteriaRepository.findById(criteria.id, criteria.goalId)) as Criteria;

    const criteriaToUpdate: Criteria = {
      ...savedCriteria,
      description: 'My criteria, my rules'
    };

    await criteriaRepository.update(savedCriteria.id, savedCriteria.goalId, criteriaToUpdate);

    const updatedCriteria = await criteriaRepository.findById(savedCriteria.id, savedCriteria.goalId);

    expect(updatedCriteria?.description).toEqual('My criteria, my rules');
    expect(updatedCriteria?.updatedAt).not.toBeNull();
  });

  it('should delete a criteria', async () => {
    await criteriaRepository.save(criteria);

    const savedCriteria = await criteriaRepository.findById(criteria.id, criteria.goalId);

    expect(savedCriteria).not.toBeUndefined();

    await criteriaRepository.delete(criteria.id, criteria.goalId);

    const deletedCriteria = await criteriaRepository.findById(criteria.id, criteria.goalId);

    expect(deletedCriteria).toBeUndefined();
  });

  it('should find all criteria', async () => {
    const anotherCriteria: Criteria = {
      id: uuidv4(),
      goalId: goal.id,
      description: faker.lorem.sentence(),
      weight: faker.number.int({ min: 1, max: 10 }),
      createdAt: new Date()
    };

    await criteriaRepository.save(criteria);
    await criteriaRepository.save(anotherCriteria);

    const criteriaList = await criteriaRepository.findAll(goal.id);

    expect(criteriaList.length).toEqual(2);
  });
});
