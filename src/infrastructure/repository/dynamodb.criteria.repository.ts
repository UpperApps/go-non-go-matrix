// TODO Implement DynamoDB Criteria Repository

import { CriteriaRepository } from '../../domain/criteria/criteria.repository';
import { Criteria } from '../../domain/criteria/criteria';

// TODO Implement DynamoDB Criteria Repository
export class DynamodbCriteriaRepository implements CriteriaRepository {
  delete(id: string, goalId: string): Promise<void> {
    return Promise.resolve(undefined);
  }

  findAll(goalId: string): Promise<Criteria[]> {
    return Promise.resolve([]);
  }

  findById(id: string, goalId: string): Promise<Criteria | undefined> {
    return Promise.resolve(undefined);
  }

  save(criteria: Criteria): Promise<void> {
    return Promise.resolve(undefined);
  }

  update(id: string, goalId: string, criteria: Criteria): Promise<void> {
    return Promise.resolve(undefined);
  }
}
