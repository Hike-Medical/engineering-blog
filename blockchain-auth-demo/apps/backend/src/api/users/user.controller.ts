import { User } from '@/decorators/user.decorator';
import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findCurrent(@User('id') userId: string) {
    return await this.userService.findById(userId);
  }
}
