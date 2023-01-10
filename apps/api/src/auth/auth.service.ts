import { Injectable, BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from "argon2";
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JWTPayload } from './types/jwt-payload.type';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { ResendVerificationEmailDto } from './dtos/resend-verification-email.dto';
import { generateVerifyToken } from 'src/util/generate-verify-token';
import { User } from '@acme/db';
import { BeginPasswordRecoveryDto } from './dtos/begin-password-recovery.dto';
import { CheckPasswordRecoveryTokenDto } from './dtos/check-password-recovery-token.dto';
import { LiteUser } from './types/lite-user.type';
import { RecoverPasswordDto } from './dtos/recover-password.dto';

@Injectable()
export class AuthService {
  constructor(
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

  public async register(data: RegisterDto): Promise<LiteUser> {
    const exists = await this.userService.findByEmail(data.email);

    if (exists) {
      throw new BadRequestException('User already exists')
    }

    const hash = await argon2.hash(data.password);
    const verifyEmailToken = generateVerifyToken(2);
    const newUser = await this.userService.createNewUser({
      ...data,
      password: hash,
      verify_email_token: verifyEmailToken.token,
      verify_email_expires: verifyEmailToken.expiresIn,
    });

    // TODO send email with token

    return { id: newUser.id, email: newUser.email };
    // const { accessToken, refreshToken, refreshTokenExpires } = await this.getTokens({ sub: newUser.id, email: newUser.email });
    // await this.userService.updateRefreshTokenById(newUser.id, refreshToken, refreshTokenExpires);

    // return {
    //   access_token: accessToken,
    //   refresh_token: refreshToken,
    // };
  }
  
  public async login(data: LoginDto) {
    const user = await this.validateUser(data);

    if (!user.email_verified) {
      throw new UnauthorizedException("Email is not yet verified");
    }

    const { accessToken, refreshToken, refreshTokenExpires } = await this.getTokens({ sub: user.id, email: user.email });
    await this.userService.updateRefreshTokenById(user.id, refreshToken, refreshTokenExpires);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  public async logout(token: string) {
    await this.userService.deleteRefreshToken(token);
  }

  public async verifyEmail(data: VerifyEmailDto): Promise<LiteUser> {
    const user = await this.userService.checkVerifyTokenAndVerifyEmail(data.token);
    // if (user) {
    //   // TODO maybe send welcome message
    // }

    return { id: user.id, email: user.email };
  }

  public async resendVerificationEmail(data: ResendVerificationEmailDto): Promise<LiteUser> {
    const user = await this.userService.updateVerifyToken(data.email);

    // TODO send verification email

    return { id: user.id, email: user.email };
  }

  public async beginPasswordRecovery(data: BeginPasswordRecoveryDto): Promise<LiteUser> {
    const user = await this.userService.updatePasswordRecoveryToken(data.email);

    // TODO send password reset email

    return { id: user.id, email: user.email };
  }

  public async checkPasswordRecoveryToken(data: CheckPasswordRecoveryTokenDto): Promise<LiteUser> {
    const user = await this.userService.checkPasswordRecoveryToken(data.token);

    return { id: user.id, email: user.email };
  }

  public async recoverPassword(data: RecoverPasswordDto): Promise<LiteUser> {
    const user = await this.userService.recoverPassword(data);

    return { id: user.id, email: user.email };
  }

  public async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findByIdWithTokens(userId);
    if (!user || user.refresh_tokens?.length <= 0) {
      throw new ForbiddenException("Access denied");
    }

    const foundToken = user.refresh_tokens.find(t => t.token === refreshToken);
    if (!foundToken || foundToken.expires_at < new Date()) {
      const payload: JWTPayload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      
      await this.userService.deleteAllRefreshTokens(payload.sub);

      // TODO log security alert

      throw new ForbiddenException("Access denied");
    }

    const tokens = await this.getTokens({ sub: user.id, email: user.email });
    await this.userService.updateRefreshTokenById(user.id, tokens.refreshToken, tokens.refreshTokenExpires, refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  private async getTokens(payload: JWTPayload) {
    // 30 days in seconds
    const refreshTokenExpires = Math.floor((Date.now() / 1000) + (60 * 60 * 24 * 30));

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '5m',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      }),

      this.jwtService.signAsync(payload, {
        expiresIn: refreshTokenExpires,
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      refreshTokenExpires,
    };
  }
}
