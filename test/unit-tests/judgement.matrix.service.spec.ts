import { Criteria } from '../../src/domain/criteria/criteria';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { CriteriaRepository } from '../../src/domain/criteria/criteria.repository';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { JudgementMatrixService } from '../../src/domain/judgement-matrix/judgement.matrix.service';
import { JudgementMatrixRepository } from '../../src/domain/judgement-matrix/judgement.matrix.repository';

describe('Test JudgementMatrixService', () => {
  let criteriaRepository: DeepMocked<CriteriaRepository>;
  let judgementMatrixRepository: DeepMocked<JudgementMatrixRepository>;
  let judgementMatrixService: JudgementMatrixService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CriteriaRepository,
          useValue: createMock<CriteriaRepository>()
        },
        {
          provide: JudgementMatrixRepository,
          useValue: createMock<JudgementMatrixRepository>()
        }
      ]
    }).compile();

    criteriaRepository = testingModule.get(CriteriaRepository);
    judgementMatrixRepository = testingModule.get(JudgementMatrixRepository);
    judgementMatrixService = new JudgementMatrixService(judgementMatrixRepository, criteriaRepository);
  });
  afterEach(async () => {});

  it('should save the matrix of criteria to be evaluated', async () => {});

  it('should return the matrix of criteria to be evaluated including new criteria', async () => {
    const goalId = uuidv4();
    const criteria: Criteria[] = [
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      }
    ];

    criteriaRepository.findAll.mockResolvedValue(criteria);

    const criteriaMatrix = await judgementMatrixService.getCriteriaCartesianProduct(goalId);

    console.log(criteriaMatrix);

    expect(criteriaMatrix.length).toBe(16);
  });

  it('should update the matrix of criteria to be evaluated', async () => {
    const goalId = uuidv4();
    const criteria: Criteria[] = [
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: goalId,
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      }
    ];

    criteriaRepository.findAll.mockResolvedValue(criteria);

    const criteriaMatrix = await judgementMatrixService.getCriteriaCartesianProduct(goalId);

    // TODO: Compare if the two criteria in the array are the same.
    // TODO: If they are the same, remove the array from the matrix.
    const arrayWithoutSameCriteria = criteriaMatrix.reduce((acc, currentValue) => {
      return currentValue[0].id !== currentValue[1].id ? acc.push([currentValue[0], currentValue[1]]) : acc;
    }, [] as Criteria[][]);

    // TODO: Compare if we have another identical criteria array in the matrix. If we do, remove it.

    console.log(arrayWithoutSameCriteria);

    expect(arrayWithoutSameCriteria).toBe(12);
    expect(criteriaMatrix.length).toBe(16);
  });

  it('should delete the matrix of criteria to be evaluated', async () => {});
});
