import { Inject, Injectable } from '@nestjs/common';
import { GoalRepository } from '../goal/goal.repository';
import { EntityNotFoundException } from '../exceptions/entity-not-found-exception';
import { ItemRepository } from './item.repository';
import { Item } from './item';

@Injectable()
export class ItemService {
  constructor(
    @Inject(GoalRepository) private readonly goalRepository: GoalRepository,
    @Inject(ItemRepository) private readonly itemRepository: ItemRepository
  ) {
    this.goalRepository = goalRepository;
    this.itemRepository = itemRepository;
  }

  public async save(userId: string, goalId: string, item: Item) {
    const goalFound = await this.goalRepository.findById(goalId, userId);
    if (goalFound === undefined || !goalFound) {
      throw new EntityNotFoundException(`Goal with id ${goalId} not found`);
    }

    await this.itemRepository.save(item);
  }
}
