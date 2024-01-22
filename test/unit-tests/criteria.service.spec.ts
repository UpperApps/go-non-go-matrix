import { Goal } from '../../src/domain/goal/goal';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { GoalRepository } from '../../src/domain/goal/goal.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import { EntityNotFoundException } from '../../src/domain/exceptions/entity-not-found-exception';
import { CriteriaRepository } from '../../src/domain/criteria/criteria.repository';
import { CriteriaService } from '../../src/domain/criteria/criteria.service';
import { Criteria } from '../../src/domain/criteria/criteria';

describe('Test Goal service', () => {
  let goal: Goal;
  let criteria: Criteria;
  let criteriaService: CriteriaService;
  let goalRepository: DeepMocked<GoalRepository>;
  let criteriaRepository: DeepMocked<CriteriaRepository>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CriteriaRepository,
          useValue: createMock<CriteriaRepository>()
        },
        {
          provide: GoalRepository,
          useValue: createMock<GoalRepository>()
        }
      ]
    }).compile();

    criteriaRepository = testingModule.get(CriteriaRepository);
    goalRepository = testingModule.get(GoalRepository);
    criteriaService = new CriteriaService(goalRepository, criteriaRepository);

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

  it('should save a goal and find it by id', async () => {
    goalRepository.findById.mockResolvedValue(goal);
    criteriaRepository.save.mockResolvedValue(void 0);
    await criteriaService.save(goal.userId, goal.id, criteria);

    expect(goalRepository.findById).toHaveBeenCalledWith(goal.id, goal.userId);
    expect(criteriaRepository.save).toHaveBeenCalledWith(criteria);
  });

  it('should throw an exception if user does not exists', () => {
    goalRepository.findById.mockResolvedValue(undefined);

    expect(async () => {
      await criteriaService.save(goal.userId, goal.id, criteria);
    }).rejects.toThrow(EntityNotFoundException);
    expect(criteriaRepository.save).not.toHaveBeenCalled();
  });
});
