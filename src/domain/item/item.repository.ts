import { Item } from './item';

export interface ItemRepository {
  save(item: Item): Promise<void>;
  findById(itemId: string, goalId: string): Promise<Item | undefined>;
  findAll(goalId: string): Promise<Item[]>;
  update(item: Item): Promise<void>;
  delete(itemId: string, goalId: string): Promise<void>;
}

export const ItemRepository = Symbol('ItemRepository');
