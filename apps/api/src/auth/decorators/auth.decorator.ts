import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "@prisma/client";
import { AccessAuthGuard } from "../guards/access-jwt.guard";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";

export const Auth = (...roles: Role[]) => applyDecorators(
  Roles(...roles),
  UseGuards(AccessAuthGuard, RolesGuard),
);