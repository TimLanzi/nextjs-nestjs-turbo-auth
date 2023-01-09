import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { JWTPayload } from '../types/jwt-payload.type';
import { type ICurrentUser } from '../types/current-user.type';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
    private prisma: PrismaService,
    protected configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessJwtStrategy.extractJwtFromCookies,
        AccessJwtStrategy.extractJwtFromHeader
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JWTPayload): Promise<ICurrentUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: false,
      },
    });
    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }

  private static extractJwtFromCookies(req: Request): string | null {
    if (req.cookies && 'access-token' in req.cookies) {
      return req.cookies['access-token'];
    }
    return null;
  }

  private static extractJwtFromHeader(req: Request): string | null {
    if ('x-access-token' in req.headers) {
      let token: string = req.headers['x-access-token'] as string;
      if (token.startsWith('Bearer ')) {
        token = token.replace('Bearer ', '');
      }
      return token;
    }

    return null;
  }
}
