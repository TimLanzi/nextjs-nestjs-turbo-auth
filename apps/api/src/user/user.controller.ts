import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ICurrentUser } from 'src/auth/types/current-user.type';

@Controller('user')
export class UserController {
  @Auth('ADMIN')
  @Get('admin')
  async adminTestRoute(
    @CurrentUser() user: ICurrentUser,
  ) {
    return {message: 'hello there, admin'}
  }

  @Auth('MODERATOR')
  @Get('moderator')
  async modTestRoute(
    @CurrentUser() user: ICurrentUser,
  ) {
    return {message: 'hello there, moderator'}
  }
}
