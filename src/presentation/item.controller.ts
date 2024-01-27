import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { EntityNotFoundException } from '../domain/exceptions/entity-not-found-exception';
import { ItemRepository } from '../domain/item/item.repository';
import { ItemService } from '../domain/item/item.service';
import { ItemOutDto } from './dto/out/item.out.dto';
import { ItemInDto } from './dto/in/item.in.dto';
import { Item } from '../domain/item/item';

@ApiTags('Goals Items')
@Controller('users/:userId/goals/:goalId/items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);

  constructor(
    @Inject(ItemRepository)
    private readonly itemRepository: ItemRepository,
    private readonly itemService: ItemService
  ) {}

  @Get()
  async findAll(@Param('goalId') goalId: string): Promise<ItemOutDto[]> {
    return await this.itemRepository.findAll(goalId).then((items) => {
      return items.map(
        (item) => new ItemOutDto(item.id, item.goalId, item.name, item.description, item.createdAt, item.updatedAt)
      );
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Param('goalId') goalId: string): Promise<ItemOutDto> {
    const item = await this.itemRepository.findById(id, goalId);

    if (item === undefined) {
      throw new NotFoundException(`Criteria with id ${id} not found`);
    }

    return new ItemOutDto(item.id, item.goalId, item.name, item.description, item.createdAt, item.updatedAt);
  }

  @Post()
  async create(
    @Body() item: ItemInDto,
    @Param('userId') userId: string,
    @Param('goalId') goalId: string
  ): Promise<void> {
    const id = uuid();
    const createdAt = new Date();

    const itemToSave = { ...item, id, goalId, createdAt } as Item;

    try {
      await this.itemService.save(userId, goalId, itemToSave);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Param('goalId') goalId: string, @Body() goal: ItemInDto): Promise<void> {
    try {
      const itemFromDB = await this.itemRepository.findById(id, goalId);
      const itemToUpdate = { ...itemFromDB, ...goal } as Item;

      await this.itemRepository.update(itemToUpdate);
    } catch (error) {
      this.logger.error(`Error updating item: ${error}`);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string, @Param('goalId') goalId: string): Promise<void> {
    await this.itemRepository.delete(id, goalId);
  }
}
