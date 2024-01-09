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
  Put,
} from '@nestjs/common';
import { UserRepository } from '../domain/user/user.repository';
import { User } from '../domain/user/user';
import { UserInDto } from './dto/in/user.in.dto';
import { v4 as uuid } from 'uuid';
import { UserOutDto } from './dto/out/user.out.dto';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @Inject(UserRepository) private readonly userRepository: UserRepository,
  ) {}

  @Get()
  async findAll(): Promise<UserOutDto[]> {
    return await this.userRepository.findAll().then((users) => {
      return users.map(
        (user) =>
          new UserOutDto(
            user.id,
            user.firstName,
            user.lastName,
            user.email,
            user.createdAt,
            user.updatedAt,
          ),
      );
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserOutDto> {
    const user = await this.userRepository.findById(id);

    if (user === undefined) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return new UserOutDto(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.createdAt,
      user.updatedAt,
    );
  }

  @Post()
  async create(@Body() user: UserInDto): Promise<void> {
    const id = uuid();
    const createdAt = new Date();
    const userToSave = { ...user, id, createdAt } as User;

    await this.userRepository.save(userToSave);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: UserInDto,
  ): Promise<void> {
    try {
      const userFromDB = await this.userRepository.findById(id);
      const userToUpdate = { ...userFromDB, ...user } as User;

      await this.userRepository.update(id, userToUpdate);
    } catch (error) {
      this.logger.error(`Error updating user: ${error}`);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
