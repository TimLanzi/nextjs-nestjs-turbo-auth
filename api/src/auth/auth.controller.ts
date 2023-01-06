import { Body, Controller, Get, Post, Request, UseGuards, Res } from '@nestjs/common';
import { Response } from "express";
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AccessAuthGuard } from './guards/access-jwt.guard';
import { RefreshAuthGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(data);

    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', result.access_token, { httpOnly: true })
    return result;
  }

  @Post('register')
  async register(@Body() data: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(data);

    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', result.access_token, { httpOnly: true })
    return result;
  }

  @UseGuards(AccessAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', '', { httpOnly: true, expires: new Date() });
  }

  @UseGuards(AccessAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req) {
    return req.user
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refresh(@Request() req) {
    const userId = req.user.id;
    const refreshToken = req.user.refreshToken;

    return this.authService.refreshTokens(userId, refreshToken);
  }
}
