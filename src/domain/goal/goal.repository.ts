import { Goal } from './goal';

export interface GoalRepository {
  save: (goal: Goal) => Promise<void>;
  update: (id: string, goal: Goal) => Promise<void>;
  findById: (id: string) => Promise<Goal | undefined>;
  findAll: () => Promise<Goal[]>;
  delete: (id: string) => Promise<void>;
}

export const GoalRepository = Symbol('GoalRepository');
