import { User } from "@acme/db";

export type ICurrentUser = Omit<User, 'password'>;