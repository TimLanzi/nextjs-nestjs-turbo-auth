import { Controller, Get, UseFilters } from '@nestjs/common';
import { Api } from '@ts-rest/nest';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ICurrentUser } from 'src/auth/types/current-user.type';
import { ZodExceptionFilter } from 'src/util/zod-exception.filter';
import { s } from './user.contract';

@Controller()
@UseFilters(new ZodExceptionFilter())
export class UserController {
  @Auth('ADMIN')
  @Api(s.route.user.adminTest)
  async adminTestRoute(
    @CurrentUser() user: ICurrentUser,
  ) {
    return {message: 'hello there, admin'}
  }

  @Auth('MODERATOR')
  @Api(s.route.user.moderatorTest)
  async modTestRoute(
    @CurrentUser() user: ICurrentUser,
  ) {
    return {message: 'hello there, moderator'}
  }
}
