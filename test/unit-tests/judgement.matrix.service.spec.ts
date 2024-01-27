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

  it('should get the matrix of criteria to be evaluated', async () => {
    const goalId = uuidv4();
    const criteria: Criteria[] = [
      {
        id: uuidv4(),
        goalId: uuidv4(),
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: uuidv4(),
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: uuidv4(),
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      },
      {
        id: uuidv4(),
        goalId: uuidv4(),
        description: faker.lorem.sentence(),
        weight: faker.number.int({ min: 1, max: 10 }),
        createdAt: new Date()
      }
    ];

    criteriaRepository.findAll.mockResolvedValue(criteria);

    const criteriaMatrix = await judgementMatrixService.getJudgementMatrix(goalId);

    console.log(criteriaMatrix);

    expect(criteriaMatrix.length).toBe(12);
  });

  it('should update the matrix of criteria to be evaluated', async () => {});

  it('should delete the matrix of criteria to be evaluated', async () => {});
});
