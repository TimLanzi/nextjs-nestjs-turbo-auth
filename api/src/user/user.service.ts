import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateNewUserDto } from './dtos/create-new-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByIdWithTokens(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { refresh_tokens: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email },
    });
  }

  async createNewUser(data: CreateNewUserDto) {
    return this.prisma.user.create({ data });
  }

  async updateRefreshTokenById(userId: number, token: string, expires: number, oldToken?: string) {
    // await this.prisma.user.update({
    //   where: { id },
    //   data: { refreshToken: token },
    // });

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
    //     token: oldToken,
    //   },
    //   create: {
    //     userId,
    //     token,
    //     // convert number of seconds to date object
    //     expires_at: new Date(expires * 1000)
    //   },
    //   update: {
    //     token,
    //     // convert number of seconds to date object
    //     expires_at: new Date(expires * 1000)
    //   }
    // });
  }
}
