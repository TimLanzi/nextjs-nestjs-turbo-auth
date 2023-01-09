import { Injectable, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as argon2 from "argon2";
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { JWTPayload } from './types/jwt-payload.type';
import { RefreshUser } from './types/refresh-user.type';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: LoginDto): Promise<any> {
    const user = await this.userService.findByEmail(data.email);
    if (!user) {
      throw new NotFoundException("User does not exist");
    }

    if (!(await argon2.verify(user.password, data.password))) {
      throw new BadRequestException("Invalid credentials");
    }

    const { password, ...result } = user;
    return result;
  }

  async register(data: RegisterDto) {
    const exists = await this.userService.findByEmail(data.email);

    if (exists) {
      throw new BadRequestException('User already exists')
    }

    const hash = await argon2.hash(data.password);
    const newUser = await this.userService.createNewUser({
      ...data,
      password: hash,
    });

    const { accessToken, refreshToken, refreshTokenExpires } = await this.getTokens({ sub: newUser.id, email: newUser.email });
    await this.userService.updateRefreshTokenById(newUser.id, refreshToken, refreshTokenExpires);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  
  async login(data: LoginDto) {
    const user = await this.validateUser(data);

    const { accessToken, refreshToken, refreshTokenExpires } = await this.getTokens({ sub: user.id, email: user.email });
    await this.userService.updateRefreshTokenById(user.id, refreshToken, refreshTokenExpires);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(token: string) {
    await this.userService.deleteRefreshToken(token);
  }

  async getTokens(payload: JWTPayload) {
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

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userService.findByIdWithTokens(userId);
    if (!user || user.refresh_tokens?.length <= 0) {
      throw new ForbiddenException("Access denied");
    }

    const foundToken = user.refresh_tokens.find(t => t.token === refreshToken);
    if (!foundToken || foundToken.expires_at < new Date()) {
      throw new ForbiddenException("Access denied");
    }

    const tokens = await this.getTokens({ sub: user.id, email: user.email });
    await this.userService.updateRefreshTokenById(user.id, tokens.refreshToken, tokens.refreshTokenExpires, refreshToken);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }
}
