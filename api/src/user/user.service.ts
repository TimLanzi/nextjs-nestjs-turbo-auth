import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateNewUserDto } from './dtos/create-new-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
  ) {}

  public async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  public async findByIdWithTokens(id: number) {
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
    userId: number,
    token: string,
    expires: number,
    oldToken?: string,
  ) {
    // convert number of seconds to date object
    const expires_at = new Date(expires * 1000);

    // if (oldToken) {
    //   await this.prisma.refreshToken.update({
    //     where: { token: oldToken },
    //     data: {
    //       token,
    //       expires_at,
    //     },
    //   });
    // } else {
    //   await this.prisma.refreshToken.create({
    //     data: {
    //       userId,
    //       token,
    //       expires_at,
    //     },
    //   });
    // }

    await this.prisma.refreshToken.upsert({
      where: {
        token: oldToken  || '',
      },
      create: {
        userId,
        token,
        expires_at,
      },
      update: {
        token,
        expires_at,
      },
    });
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

  public async deleteAllRefreshTokens(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
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
