import { UserRepository } from './user.repository';
import { Controller, Get, Post } from '@nestjs/common';
import { User } from './user';

@Controller('users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  @Get(':id')
  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }

  @Post()
  async save(user: User): Promise<void> {
    this.userRepository.save(user);
  }
}
