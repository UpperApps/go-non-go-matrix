import { User } from '../../src/domain/user/user';
import { Goal } from '../../src/domain/goal/goal';
import { GoalRepository } from '../../src/domain/goal/goal.repository';
import { v4 as uuidv4 } from 'uuid';
import { fakerEN as faker } from '@faker-js/faker';
import { UserRepository } from '../../src/domain/user/user.repository';
import { GoalService } from '../../src/domain/goal/goal.service';
import { EntityNotFoundException } from '../../src/domain/exceptions/entity-not-found-exception';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('Test Goal service', () => {
  let user: User;
  let goal: Goal;
  let goalService: GoalService;
  let goalRepository: DeepMocked<GoalRepository>;
  let userRepository: DeepMocked<UserRepository>;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: createMock<UserRepository>()
        },
        {
          provide: GoalRepository,
          useValue: createMock<GoalRepository>()
        }
      ]
    }).compile();

    userRepository = testingModule.get(UserRepository);
    goalRepository = testingModule.get(GoalRepository);
    goalService = new GoalService(goalRepository, userRepository);

    user = {
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date()
    };

    goal = {
      id: uuidv4(),
      userId: user.id,
      name: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      maxScore: faker.number.int({ min: 5, max: 10 }),
      createdAt: new Date()
    };
  });

  it('should save a goal and find it by id', async () => {
    userRepository.findById.mockResolvedValue(user);
    goalRepository.save.mockResolvedValue(void 0);
    await goalService.save(goal);

    expect(userRepository.findById).toHaveBeenCalledWith(goal.userId);
    expect(goalRepository.save).toHaveBeenCalledWith(goal);
  });

  it('should throw an exception if user does not exists', () => {
    userRepository.findById.mockResolvedValue(undefined);

    expect(async () => {
      await goalService.save(goal);
    }).rejects.toThrow(EntityNotFoundException);
    expect(goalRepository.save).not.toHaveBeenCalled();
  });
});
