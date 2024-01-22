import { Inject, Injectable } from '@nestjs/common';
import { GoalRepository } from '../goal/goal.repository';
import { CriteriaRepository } from './criteria.repository';
import { EntityNotFoundException } from '../exceptions/entity-not-found-exception';
import { Criteria } from './criteria';

@Injectable()
export class CriteriaService {
  constructor(
    @Inject(GoalRepository) private readonly goalRepository: GoalRepository,
    @Inject(CriteriaRepository) private readonly criteriaRepository: CriteriaRepository
  ) {
    this.goalRepository = goalRepository;
    this.criteriaRepository = criteriaRepository;
  }

  public async save(userId: string, goalId: string, criteria: Criteria) {
    const goalFound = await this.goalRepository.findById(goalId, userId);
    if (goalFound === undefined || !goalFound) {
      throw new EntityNotFoundException(`Goal with id ${goalId} not found`);
    }

    await this.criteriaRepository.save(criteria);
  }
}
