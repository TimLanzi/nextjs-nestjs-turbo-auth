import { BaseEvent } from "../base.event";

type IVerifyEmailEvent = {
  email: string;
  token: string;
}

export class VerifyEmailEvent extends BaseEvent<IVerifyEmailEvent> {
  static id = 'email.verification-email';
}