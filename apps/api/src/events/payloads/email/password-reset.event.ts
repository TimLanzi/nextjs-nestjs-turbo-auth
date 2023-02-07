import { BaseEvent } from "../base.event";

type IPasswordResetEmailEvent = {
  email: string;
  url: string;
};

export class PasswordResetEmailEvent extends BaseEvent<IPasswordResetEmailEvent> {
  static id = "email.password-reset";
}
