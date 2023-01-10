import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessAuthGuard extends AuthGuard('access-jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, _info) {
    if (err || !user) {
      throw new UnauthorizedException(err.message || 'AccessTokenError');
    }
    return user;
  }
}