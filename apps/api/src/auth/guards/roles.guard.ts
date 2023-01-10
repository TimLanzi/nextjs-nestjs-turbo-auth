import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "@acme/db";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();
    if (!user.email_verified) {
      throw new UnauthorizedException("Email has not been verified")
    }

    if (!requiredRoles.length) {
      return true;
    }

    return requiredRoles.some(role => user.role === role);

    // if users have multiple roles saved in database
    // return requiredRoles.some(role => user.roles?.includes(role));
  }
}