import { User } from "@prisma/client";

export type ICurrentUser = Omit<User, 'password'>;