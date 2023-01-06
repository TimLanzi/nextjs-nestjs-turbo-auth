import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWTPayload } from '../types/jwt-payload.type';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
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

  async validate(payload: JWTPayload) {
    return { id: payload.sub, email: payload.email };
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
