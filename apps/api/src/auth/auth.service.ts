import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JwtService } from "@nestjs/jwt";
import { User } from "@acme/db";
import * as argon2 from "argon2";
import { PasswordResetEmailEvent } from "src/events/payloads/email/password-reset.event";
import { VerifyEmailEvent } from "src/events/payloads/email/verify-email.event";
import { generateVerifyToken } from "src/util/generate-verify-token";

import { UserService } from "src/user/user.service";
import { BeginPasswordResetDto } from "./dtos/begin-password-reset.dto";
import { CheckPasswordResetTokenDto } from "./dtos/check-password-reset-token.dto";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";
import { ResendVerificationEmailDto } from "./dtos/resend-verification-email.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { VerifyEmailDto } from "./dtos/verify-email.dto";
import { JWTPayload } from "./types/jwt-payload.type";
import { LiteUser } from "./types/lite-user.type";

@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser(data: LoginDto): Promise<User> {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new BadRequestException("User does not exist");
    }

    if (!(await argon2.verify(user.password, data.password))) {
      throw new BadRequestException("Invalid credentials");
    }

    return user;
  }

  public async register(data: RegisterDto, baseUrl: string): Promise<LiteUser> {
    const exists = await this.userService.findByEmail(data.email);

    if (exists) {
      throw new BadRequestException("User already exists");
    }

    const hash = await argon2.hash(data.password);
    const { token, expiresIn } = generateVerifyToken(2);
    const newUser = await this.userService.createNewUser({
      email: data.email,
      password: hash,
      verify_email_token: token,
      verify_email_expires: expiresIn,
    });

    const verifyUrl = `${baseUrl}/auth/verify-email?token=${token}&email=${data.email}`;
    this.eventEmitter.emit(
      VerifyEmailEvent.id,
      new VerifyEmailEvent({
        email: newUser.email,
        url: verifyUrl,
      }),
    );

    return { id: newUser.id, email: newUser.email };
  }

  public async login(data: LoginDto) {
    const user = await this.validateUser(data);

    if (!user.email_verified) {
      throw new UnauthorizedException("Email is not yet verified");
    }

    const {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    } = await this.getTokens({ sub: user.id, email: user.email });
    await this.userService.updateRefreshTokenById(
      user.id,
      refreshToken,
      refreshTokenExpires,
    );

    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }

  public async logout(token: string) {
    await this.userService.deleteRefreshToken(token);
  }

  public async verifyEmail(data: VerifyEmailDto): Promise<LiteUser> {
    const user = await this.userService.checkVerifyTokenAndVerifyEmail(data);
    // if (user) {
    //   // TODO maybe send welcome message
    // }

    return { id: user.id, email: user.email };
  }

  public async resendVerificationEmail(
    data: ResendVerificationEmailDto,
    baseUrl: string,
  ): Promise<LiteUser> {
    const user = await this.userService.updateVerifyToken(data.email);
    if (!user.verify_email_token) {
      throw new BadRequestException("Error generating verification token");
    }

    const verifyUrl = `${baseUrl}/auth/verify-email?token=${user.verify_email_token}&email=${user.email}`;
    this.eventEmitter.emit(
      VerifyEmailEvent.id,
      new VerifyEmailEvent({
        email: user.email,
        url: verifyUrl,
      }),
    );

    return { id: user.id, email: user.email };
  }

  public async beginPasswordReset(
    data: BeginPasswordResetDto,
    baseUrl: string,
  ): Promise<LiteUser> {
    const user = await this.userService.updatePasswordResetToken(data.email);
    if (!user.password_reset_token) {
      throw new BadRequestException("Error generating reset token");
    }

    const resetUrl = `${baseUrl}/auth/password-reset/reset?token=${user.password_reset_token}&email=${user.email}`;
    this.eventEmitter.emit(
      PasswordResetEmailEvent.id,
      new PasswordResetEmailEvent({
        email: user.email,
        url: resetUrl,
      }),
    );

    return { id: user.id, email: user.email };
  }

  public async checkPasswordResetToken(
    data: CheckPasswordResetTokenDto,
  ): Promise<LiteUser> {
    const user = await this.userService.checkPasswordResetToken(data);

    return { id: user.id, email: user.email };
  }

  public async resetPassword(data: ResetPasswordDto): Promise<LiteUser> {
    const user = await this.userService.resetPassword(data);

    return { id: user.id, email: user.email };
  }

  public async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findByIdWithTokens(userId);
    if (!user || user.refresh_tokens?.length <= 0) {
      throw new ForbiddenException("Access denied");
    }

    const foundToken = user.refresh_tokens.find(
      (t) => t.token === refreshToken,
    );
    if (!foundToken || foundToken.expires_at < new Date()) {
      const payload: JWTPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get("REFRESH_TOKEN_SECRET"),
        },
      );

      await this.userService.deleteAllRefreshTokens(payload.sub);

      // TODO log security alert

      throw new ForbiddenException("Access denied");
    }

    const tokens = await this.getTokens({ sub: user.id, email: user.email });
    await this.userService.updateRefreshTokenById(
      user.id,
      tokens.refreshToken,
      tokens.refreshTokenExpires,
      refreshToken,
    );

    return tokens;
  }

  private async getTokens(payload: JWTPayload) {
    // 5 minutes in seconds
    const accessTokenExpires = Math.floor(Date.now() / 1000 + 60 * 5);
    // 30 days in seconds
    const refreshTokenExpires = Math.floor(
      Date.now() / 1000 + 60 * 60 * 24 * 30,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: accessTokenExpires,
        secret: this.configService.get("ACCESS_TOKEN_SECRET"),
      }),

      this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpires,
        secret: this.configService.get("REFRESH_TOKEN_SECRET"),
      }),
    ]);

    return {
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }
}
