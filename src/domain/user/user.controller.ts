import { Controller, Get, Post } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  @Get(':id')
  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }

  @Post()
  async save(user: User): Promise<void> {
    await this.userRepository.save(user);
  }
}
