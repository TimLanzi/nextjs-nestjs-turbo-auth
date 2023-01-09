import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('user')
export class UserController {
  @Auth('ADMIN')
  @Get('admin')
  async adminTestRoute(@CurrentUser() user) {
    return {message: 'hello there, admin'}
  }
}
