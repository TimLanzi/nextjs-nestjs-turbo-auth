import { Controller, UseGuards, Res, UseFilters } from '@nestjs/common';
// import { Response } from "express";
import { Api, ApiDecorator } from '@ts-rest/nest';
import { AuthService } from './auth.service';
import { s, AuthControllerShape, AuthRouteShape } from "./auth.contract";
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AccessAuthGuard } from './guards/access-jwt.guard';
import { RefreshAuthGuard } from './guards/refresh-jwt.guard';
import { type ICurrentUser } from './types/current-user.type';
import { type RefreshUser } from './types/refresh-user.type';
import { ZodExceptionFilter } from 'src/util/zod-exception.filter';

@Controller()
@UseFilters(new ZodExceptionFilter())
export class AuthController implements AuthControllerShape {
  constructor(private authService: AuthService) {}

  @Api(s.route.auth.login)
  async login(
    @ApiDecorator() { body }: AuthRouteShape['login'],
    // @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body);

    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', result.access_token, { httpOnly: true })
    return result;
  }

  @Api(s.route.auth.register)
  async register(
    @ApiDecorator() { body }: AuthRouteShape['register'],
    // @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);

    // For HTTP only cookie. Uncomment to use this strategy instead.
    // res.cookie('access-token', result.access_token, { httpOnly: true })
    return result;
  }

  @UseGuards(AccessAuthGuard, RefreshAuthGuard)
  @Api(s.route.auth.logout)
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
  @Api(s.route.auth.session)
  async getCurrentUser(
    @CurrentUser() user: ICurrentUser
  ) {
    // Strip stuff we don't want the frontend to see
    const { email_verified, ...data } = user;
    return data;
  }

  @UseGuards(RefreshAuthGuard)
  @Api(s.route.auth.refresh)
  async refresh(
    @CurrentUser() user: RefreshUser,
  ) {
    const userId = user.id;
    const refreshToken = user.refreshToken;

    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Api(s.route.auth.verifyEmail)
  async verifyEmail(
    @ApiDecorator() { body }: AuthRouteShape['verifyEmail'],
  ) {
    return this.authService.verifyEmail(body);
  }

  @Api(s.route.auth.resendVerificationEmail)
  async resendVerificationEmail(
    @ApiDecorator() { body }: AuthRouteShape['resendVerificationEmail'],
  ) {
    return this.authService.resendVerificationEmail(body);
  }

  @Api(s.route.auth.startPasswordReset)
  async startPasswordReset(
    @ApiDecorator() { body }: AuthRouteShape['startPasswordReset'],
  ) {
    return this.authService.beginPasswordReset(body);
  }

  @Api(s.route.auth.checkPasswordResetToken)
  async checkPasswordResetToken(
    @ApiDecorator() { params }: AuthRouteShape['checkPasswordResetToken'],
  ) {
    return this.authService.checkPasswordResetToken(params);
  }

  @Api(s.route.auth.resetPassword)
  async resetPassword(
    @ApiDecorator() { body }: AuthRouteShape['resetPassword'],
  ) {
    return this.authService.resetPassword(body);
  }
}
