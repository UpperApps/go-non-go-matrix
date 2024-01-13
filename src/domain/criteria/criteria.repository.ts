import { Criteria } from './criteria';

export interface CriteriaRepository {
  save(criteria: Criteria): Promise<void>;
  findById(id: string, goalId: string): Promise<Criteria | undefined>;
  findAll(goalId: string): Promise<Criteria[]>;
  update(id: string, goalId: string, criteria: Criteria): Promise<void>;
  delete(id: string, goalId: string): Promise<void>;
}

export const CriteriaRepository = Symbol('CriteriaRepository');
