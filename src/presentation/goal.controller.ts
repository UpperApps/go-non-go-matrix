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
import { GoalRepository } from '../domain/goal/goal.repository';
import { GoalOutDto } from './dto/out/goal.out.dto';
import { GoalInDto } from './dto/in/goal.in.dto';
import { v4 as uuid } from 'uuid';
import { Goal } from '../domain/goal/goal';
import { ApiTags } from '@nestjs/swagger';
import { GoalService } from '../domain/goal/goal.service';
import { EntityNotFoundException } from '../domain/exceptions/entity-not-found-exception';

@ApiTags('User Goals')
@Controller('users/:userId/goals')
export class GoalController {
  private readonly logger = new Logger(GoalController.name);

  constructor(
    @Inject(GoalRepository) private readonly goalRepository: GoalRepository,
    private readonly goalService: GoalService
  ) {}

  @Get()
  async findAll(@Param('userId') userId: string): Promise<GoalOutDto[]> {
    return await this.goalRepository.findAll(userId).then((goals) => {
      return goals.map(
        (goal) =>
          new GoalOutDto(
            goal.id,
            goal.userId,
            goal.name,
            goal.description,
            goal.maxScore,
            goal.createdAt,
            goal.updatedAt
          )
      );
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Param('userId') userId: string): Promise<GoalOutDto> {
    const goal = await this.goalRepository.findById(id, userId);

    if (goal === undefined) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }

    return new GoalOutDto(
      goal.id,
      goal.userId,
      goal.name,
      goal.description,
      goal.maxScore,
      goal.createdAt,
      goal.updatedAt
    );
  }

  @Post()
  async create(@Body() goal: GoalInDto, @Param('userId') userId: string): Promise<void> {
    const id = uuid();
    const createdAt = new Date();

    const goalToSave = { ...goal, id, userId, createdAt } as Goal;

    try {
      await this.goalService.save(goalToSave);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Param('userId') userId: string, @Body() goal: GoalInDto): Promise<void> {
    try {
      const goalFromDB = await this.goalRepository.findById(id, userId);
      const goalToUpdate = { ...goalFromDB, ...goal } as Goal;

      await this.goalRepository.update(goalToUpdate);
    } catch (error) {
      this.logger.error(`Error updating goal: ${error}`);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string, @Param('userId') userId: string): Promise<void> {
    await this.goalRepository.delete(id, userId);
  }
}
