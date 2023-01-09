import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JWTPayload } from '../types/jwt-payload.type';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    protected configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJwtFromCookies,
        RefreshJwtStrategy.extractJwtFromHeader
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(req: Request, payload: JWTPayload) {
    let token: string = req.headers['x-refresh-token'] as string;
    if (token.startsWith('Bearer ')) {
      token = token.replace('Bearer ', '');
    }
    return { id: payload.sub, email: payload.email, refreshToken: token };
  }

  private static extractJwtFromCookies(req: Request): string | null {
    if (req.cookies && 'refresh-token' in req.cookies) {
      return req.cookies['refresh-token'];
    }
    return null;
  }

  private static extractJwtFromHeader(req: Request): string | null {
    if ('x-refresh-token' in req.headers) {
      let token: string = req.headers['x-refresh-token'] as string;
      if (token.startsWith('Bearer ')) {
        token = token.replace('Bearer ', '');
      }
      return token;
    }

    return null;
  }
}
