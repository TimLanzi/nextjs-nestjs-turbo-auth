import { BaseEvent } from "../base.event";

type IPasswordResetEmailEvent = {
  email: string;
  token: string;
}

export class PasswordResetEmailEvent extends BaseEvent<IPasswordResetEmailEvent> {
  static id = 'email.password-reset';
}