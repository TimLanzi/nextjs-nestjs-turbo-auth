import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dtos/register.dto';
import { JWTPayload } from './types/jwt-payload.type';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: LoginDto): Promise<any> {
    const user = await this.userService.findOneByEmail(data.email);
    if (!user) {
      throw new NotFoundException("User does not exist");
    }

    if (!(await argon2.verify(user.password, data.password))) {
      throw new BadRequestException("Invalid credentials");
    }

    const { password, ...result } = user;
    return result;
  }

  async register(data: RegisterDto) {
    const exists = await this.userService.findOneByEmail(data.email);

    if (exists) {
      throw new BadRequestException('User already exists')
    }

    const hash = await argon2.hash(data.password);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      }
    });

    const accessToken = await this.getToken({ sub: newUser.id, email: newUser.email });

    return {
      access_token: accessToken,
    };
  }
  
  async login(data: LoginDto) {
    const user = await this.validateUser(data);

    const token = await this.getToken({ sub: user.id, email: user.email });
    return {
      access_token: token,
    };
  }

  async getToken(payload: JWTPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '30d',
    });

    return accessToken;
  }
}
