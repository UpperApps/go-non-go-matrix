import { Item } from './item';

export interface ItemRepository {
  save(item: Item): Promise<void>;
  findById(id: string, goalId: string): Promise<Item | undefined>;
  findAll(goalId: string): Promise<Item[]>;
  update(id: string, goalId: string, item: Item): Promise<void>;
  delete(id: string, goalId: string): Promise<void>;
}

export const ItemRepository = Symbol('ItemRepository');
