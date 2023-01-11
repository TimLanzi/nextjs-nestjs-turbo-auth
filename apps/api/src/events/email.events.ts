import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PasswordRecoveryEmailEvent } from "./payloads/email/password-recovery.event";
import { VerifyEmailEvent } from "./payloads/email/verify-email.event";

@Injectable()
export class EmailEvents {
  @OnEvent(VerifyEmailEvent.id)
  handleSendVerificationEmail({ data }: VerifyEmailEvent) {
    // TODO send email with token
    console.log(data)
  }

  @OnEvent(PasswordRecoveryEmailEvent.id)
  handleSendPasswordRecoveryEmail({ data }: PasswordRecoveryEmailEvent) {
    // TODO send password reset email
    console.log(data)
  }
}