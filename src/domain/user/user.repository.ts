import type { User } from './user';

export interface UserRepository {
  save: (user: User) => Promise<void>;
  update: (id: string, user: User) => Promise<void>;
  findById: (id: string) => Promise<User | undefined>;
  findAll: () => Promise<User[]>;
  delete: (id: string) => Promise<void>;
}

export const UserRepository = Symbol('UserRepository');
