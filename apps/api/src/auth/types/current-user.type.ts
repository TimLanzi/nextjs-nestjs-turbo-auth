import { User } from "@acme/db";

export type ICurrentUser = Omit<
  User,
  | "password"
  | "verify_email_token"
  | "verify_email_expires"
  | "password_reset_token"
  | "password_reset_expires"
>;
