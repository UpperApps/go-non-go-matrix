import { GoalRepository } from '../../domain/goal/goal.repository';
import { Goal } from '../../domain/goal/goal';

// TODO: Implement this class
export class DynamodbGoalRepository implements GoalRepository {
  async findAll(): Promise<Goal[]> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<Goal | undefined> {
    throw new Error('Method not implemented.');
  }
  async save(goal: Goal): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  update(id: string, goal: Goal): Promise<void> {
    return Promise.resolve(undefined);
  }
}
