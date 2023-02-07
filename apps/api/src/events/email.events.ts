import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { PasswordResetEmailEvent } from "./payloads/email/password-reset.event";
import { VerifyEmailEvent } from "./payloads/email/verify-email.event";

@Injectable()
export class EmailEvents {
  @OnEvent(VerifyEmailEvent.id)
  handleSendVerificationEmail({ data }: VerifyEmailEvent) {
    // TODO send email with token
    console.log(data);
  }

  @OnEvent(PasswordResetEmailEvent.id)
  handleSendPasswordResetEmail({ data }: PasswordResetEmailEvent) {
    // TODO send password reset email
    console.log(data);
  }
}
