import { BaseEvent } from "../base.event";

type IPasswordRecoveryEmailEvent = {
  email: string;
  token: string;
}

export class PasswordRecoveryEmailEvent extends BaseEvent<IPasswordRecoveryEmailEvent> {
  static id = 'email.password-recovery';
}