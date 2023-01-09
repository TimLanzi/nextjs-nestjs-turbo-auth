import { Body, Controller, Get, Post, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from "express";
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AccessAuthGuard } from './guards/access-jwt.guard';
import { RefreshAuthGuard } from './guards/refresh-jwt.guard';
import { type CurrentUser as ICurrentUser } from './types/current-user.type';
import { RefreshUser } from './types/refresh-user.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: LoginDto,
    // @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(data);

    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', result.access_token, { httpOnly: true })
    return result;
  }

  @Post('register')
  async register(
    @Body() data: RegisterDto,
    // @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(data);

    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', result.access_token, { httpOnly: true })
    return result;
  }

  @UseGuards(AccessAuthGuard, RefreshAuthGuard)
  @Post('logout')
  async logout(
    @CurrentUser() user: RefreshUser
    // @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.refreshToken);
    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', '', { httpOnly: true, expires: new Date() });
    return { message: "Logout successful" };
  }

  @UseGuards(AccessAuthGuard)
  @Get('me')
  async getCurrentUser(
    @CurrentUser() user: ICurrentUser
  ) {
    return user
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refresh(
    @CurrentUser() user: RefreshUser,
  ) {
    const userId = user.id;
    const refreshToken = user.refreshToken;

    return this.authService.refreshTokens(userId, refreshToken);
  }
}
