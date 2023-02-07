import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ScheduleModule } from "@nestjs/schedule";

import { AuthModule } from "./auth/auth.module";
import { EventsModule } from "./events/events.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
