import { Goal } from './goal';

export interface GoalRepository {
  save: (goal: Goal) => Promise<void>;
  update: (goal: Goal) => Promise<void>;
  findById: (goalId: string, userId: string) => Promise<Goal | undefined>;
  findAll: (userId: string) => Promise<Goal[]>;
  delete: (goalId: string, userId: string) => Promise<void>;
}

export const GoalRepository = Symbol('GoalRepository');
