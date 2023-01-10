import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from '@acme/db';
import * as argon2 from "argon2";
import { PrismaService } from 'src/prisma.service';
import { CreateNewUserDto } from './dtos/create-new-user.dto';
import { generateVerifyToken } from 'src/util/generate-verify-token';
import { RecoverPasswordDto } from 'src/auth/dtos/recover-password.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  public async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  public async findByIdWithTokens(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { refresh_tokens: true },
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  public async createNewUser(data: CreateNewUserDto) {
    return this.prisma.user.create({ data });
  }

  public async updateRefreshTokenById(
    userId: string,
    token: string,
    expires: number,
    oldToken?: string,
  ) {
    // convert number of seconds to date object
    const expires_at = new Date(expires * 1000);

    if (oldToken) {
      await this.prisma.refreshToken.update({
        where: { token: oldToken },
        data: {
          token,
          expires_at,
        },
      });
    } else {
      await this.prisma.refreshToken.create({
        data: {
          userId,
          token,
          expires_at,
        },
      });
    }

    // await this.prisma.refreshToken.upsert({
    //   where: {
    //     token: oldToken  || '',
    //   },
    //   create: {
    //     userId,
    //     token,
    //     expires_at,
    //   },
    //   update: {
    //     token,
    //     expires_at,
    //   },
    // });
  }

  public async deleteRefreshToken(token: string) {
    try {
      await this.prisma.refreshToken.delete({
        where: { token },
      });
    } catch(e) {
      throw new BadRequestException("Error logging out");
    }
  }

  public async deleteAllRefreshTokens(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  public async checkVerifyTokenAndVerifyEmail(token: string) {
    const exists = await this.prisma.user.findFirst({
      where: {
        verify_email_token: token,
        verify_email_expires: { gte: new Date() },
      },
    });

    if (!exists) {
      throw new BadRequestException("Token is either invalid or expired");
    }

    const user = await this.prisma.user.update({
      where: { id: exists.id },
      data: {
        email_verified: true,
        verify_email_token: null,
        verify_email_expires: null,
      },
    });

    return user;
  }

  public async updateVerifyToken(email: string) {
    const { token, expiresIn } = generateVerifyToken(2);
    try {
      const user = await this.prisma.user.update({
        where: { email },
        data: {
          email_verified: false,
          verify_email_token: token,
          verify_email_expires: expiresIn,
        },
      });

      return user;
    } catch {
      throw new BadRequestException("No user with that email could be found")
    }
  }

  public async checkPasswordRecoveryToken(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        password_reset_token: token,
        password_reset_expires: { gte: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException("Token is either invalid or expired");
    }

    return user;
  }

  public async updatePasswordRecoveryToken(email: string) {
    const { token, expiresIn } = generateVerifyToken(2);
    try {
      const user = await this.prisma.user.update({
        where: { email },
        data: {
          password_reset_token: token,
          password_reset_expires: expiresIn,
        },
      });

      return user;
    } catch {
      throw new BadRequestException("No user with that email could be found")
    }
  }

  public async recoverPassword(data: RecoverPasswordDto) {
    const exists = await this.prisma.user.findFirst({
      where: {
        password_reset_token: data.token,
        password_reset_expires: { gte: new Date() },
        email: data.email,
      },
    });

    if (!exists) {
      throw new BadRequestException("Token is either invalid or expired");
    }

    if (!!(await argon2.verify(exists.password, data.password))) {
      throw new BadRequestException("New password cannot be the same as the old password");
    }

    const hash = await argon2.hash(data.password);
    const user = await this.prisma.user.update({
      where: { id: exists.id },
      data: {
        password: hash,
        password_reset_token: null,
        password_reset_expires: null,
      },
    });

    return user;
  }

  // Delete expired refresh tokens once every hour
  @Cron('0 * * * *', {
    name: 'CLEAN_REFRESH_TOKENS'
  })
  public async cleanRefreshTokens() {
    this.prisma.refreshToken.deleteMany({
      where: {
        expires_at: { lte: new Date() },
      },
    });
  }
}
