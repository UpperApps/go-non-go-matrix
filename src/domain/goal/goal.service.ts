import { Injectable } from '@nestjs/common';
import { GoalRepository } from './goal.repository';
import { Goal } from './goal';
import { UserRepository } from '../user/user.repository';
import { EntityNotFoundException } from '../exceptions/entity-not-found-exception';

@Injectable()
export class GoalService {
  private readonly goalRepository: GoalRepository;
  private readonly userRepository: UserRepository;
  constructor(goalRepository: GoalRepository, userRepository: UserRepository) {
    this.goalRepository = goalRepository;
    this.userRepository = userRepository;
  }

  public async save(goal: Goal) {
    const user = await this.userRepository.findById(goal.userId);
    if (user === undefined || !user) {
      throw new EntityNotFoundException(`User with id ${goal.userId} not found`);
    }

    await this.goalRepository.save(goal);
  }
}
