import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport/dist';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      // inject: [ConfigService],
      // useFactory: (configService: ConfigService) => ({
      //   secret: configService.get('ACCESS_TOKEN_SECRET'),
      // }),
    }),
  ],
  providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy, PrismaService],
  controllers: [AuthController],
  // exports: [AuthService],
})
export class AuthModule {}
