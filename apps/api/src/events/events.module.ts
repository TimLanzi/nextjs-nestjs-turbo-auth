import { Module } from "@nestjs/common";

import { EmailEvents } from "./email.events";

@Module({
  providers: [EmailEvents],
})
export class EventsModule {}
