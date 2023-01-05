import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { JWTPayload } from '../types/jwt-payload.type';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookies,
        JwtStrategy.extractJwtFromHeader
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
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
