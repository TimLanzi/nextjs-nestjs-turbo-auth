import { Body, Controller, Get, Post, UseGuards, Res, Param } from '@nestjs/common';
import { ZodValidation } from 'src/util/validate-zod.decorator';
// import { Response } from "express";
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { BeginPasswordRecoveryDto, BeginPasswordRecoverySchema } from './dtos/begin-password-recovery.dto';
import { CheckPasswordRecoveryTokenDto, CheckPasswordRecoveryTokenSchema } from './dtos/check-password-recovery-token.dto';
import { LoginDto, LoginSchema } from './dtos/login.dto';
import { RecoverPasswordDto, RecoverPasswordSchema } from './dtos/recover-password.dto';
import { RegisterDto, RegisterSchema } from './dtos/register.dto';
import { ResendVerificationEmailDto, ResendVerificationSchema } from './dtos/resend-verification-email.dto';
import { VerifyEmailDto, VerifyEmailSchema } from './dtos/verify-email.dto';
import { AccessAuthGuard } from './guards/access-jwt.guard';
import { RefreshAuthGuard } from './guards/refresh-jwt.guard';
import { type ICurrentUser } from './types/current-user.type';
import { type RefreshUser } from './types/refresh-user.type';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ZodValidation(LoginSchema)
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

  @ZodValidation(RegisterSchema)
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

  @Auth()
  @Get('me')
  async getCurrentUser(
    @CurrentUser() user: ICurrentUser
  ) {
    // Strip stuff we don't want the frontend to see
    const { email_verified, ...data } = user;
    return data;
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

  @ZodValidation(VerifyEmailSchema)
  @Post('verify-email')
  async verifyEmail(
    @Body() data: VerifyEmailDto,
  ) {
    return this.authService.verifyEmail(data);
  }

  @ZodValidation(ResendVerificationSchema)
  @Post('resend-verification-email')
  async resendVerificationEmail(
    @Body() data: ResendVerificationEmailDto,
  ) {
    return this.authService.resendVerificationEmail(data);
  }

  @ZodValidation(BeginPasswordRecoverySchema)
  @Post('password-recovery')
  async startPasswordRecovery(
    @Body() data: BeginPasswordRecoveryDto,
  ) {
    return this.authService.beginPasswordRecovery(data);
  }

  @ZodValidation(CheckPasswordRecoveryTokenSchema)
  @Get('password-recovery/:token')
  async checkPasswordRecoveryToken(
    @Param() data: CheckPasswordRecoveryTokenDto,
  ) {
    return this.authService.checkPasswordRecoveryToken(data);
  }

  @ZodValidation(RecoverPasswordSchema)
  @Post('reset-password')
  async resetPassword(
    @Body() data: RecoverPasswordDto
  ) {
    return this.authService.recoverPassword(data);
  }
}
