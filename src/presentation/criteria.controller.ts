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
import { CriteriaRepository } from '../domain/criteria/criteria.repository';
import { CriteriaOutDto } from './dto/out/criteria.out.dto';
import { v4 as uuid } from 'uuid';
import { CriteriaInDto } from './dto/in/criteria.in.dto';
import { Criteria } from '../domain/criteria/criteria';
import { ApiTags } from '@nestjs/swagger';
import { CriteriaService } from '../domain/criteria/criteria.service';
import { EntityNotFoundException } from '../domain/exceptions/entity-not-found-exception';

@ApiTags('Goals Criteria')
@Controller('users/:userId/goals/:goalId/criteria')
export class CriteriaController {
  private readonly logger = new Logger(CriteriaController.name);

  constructor(
    @Inject(CriteriaRepository)
    private readonly criteriaRepository: CriteriaRepository,
    private readonly criteriaService: CriteriaService
  ) {}

  @Get()
  async findAll(@Param('goalId') goalId: string): Promise<CriteriaOutDto[]> {
    return await this.criteriaRepository.findAll(goalId).then((criteria) => {
      return criteria.map(
        (criteria) =>
          new CriteriaOutDto(
            criteria.id,
            criteria.goalId,
            criteria.description,
            criteria.weight,
            criteria.createdAt,
            criteria.updatedAt
          )
      );
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Param('goalId') goalId: string): Promise<CriteriaOutDto> {
    const criteria = await this.criteriaRepository.findById(id, goalId);

    if (criteria === undefined) {
      throw new NotFoundException(`Criteria with id ${id} not found`);
    }

    return new CriteriaOutDto(
      criteria.id,
      criteria.goalId,
      criteria.description,
      criteria.weight,
      criteria.createdAt,
      criteria.updatedAt
    );
  }

  @Post()
  async create(
    @Body() criteria: CriteriaInDto,
    @Param('userId') userId: string,
    @Param('goalId') goalId: string
  ): Promise<void> {
    const id = uuid();
    const createdAt = new Date();

    const criteriaToSave = { ...criteria, id, goalId, createdAt } as Criteria;

    try {
      await this.criteriaService.save(userId, goalId, criteriaToSave);
    } catch (error) {
      if (error instanceof EntityNotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Param('goalId') goalId: string, @Body() goal: CriteriaInDto): Promise<void> {
    try {
      const criteriaFromDB = await this.criteriaRepository.findById(id, goalId);
      const criteriaToUpdate = { ...criteriaFromDB, ...goal } as Criteria;

      await this.criteriaRepository.update(criteriaToUpdate);
    } catch (error) {
      this.logger.error(`Error updating criteria: ${error}`);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string, @Param('goalId') goalId: string): Promise<void> {
    await this.criteriaRepository.delete(id, goalId);
  }
}
