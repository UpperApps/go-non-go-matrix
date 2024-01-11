import { Goal } from './goal';

export interface GoalRepository {
  save: (goal: Goal) => Promise<void>;
  update: (id: string, userId: string, goal: Goal) => Promise<void>;
  findById: (id: string, userId: string) => Promise<Goal | undefined>;
  findAll: (userId: string) => Promise<Goal[]>;
  delete: (id: string, userId: string) => Promise<void>;
}

export const GoalRepository = Symbol('GoalRepository');
