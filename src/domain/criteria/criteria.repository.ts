import { Criteria } from './criteria';

export interface CriteriaRepository {
  save(criteria: Criteria): Promise<void>;
  findById(criteriaId: string, goalId: string): Promise<Criteria | undefined>;
  findAll(goalId: string): Promise<Criteria[]>;
  update(criteria: Criteria): Promise<void>;
  delete(criteriaId: string, goalId: string): Promise<void>;
}

export const CriteriaRepository = Symbol('CriteriaRepository');
