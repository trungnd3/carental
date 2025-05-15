import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users/users.service';
import { LoginDto } from './dtos/login.dto';
import { UserPayload } from './interfaces/user-payload.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async verifyUser({ email, password }: LoginDto) {
    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  signJwt(user: User) {
    const payload: UserPayload = {
      userId: user.id,
      email: user.email,
      licenseValidTo: user.licenseValidTo,
    };

    const jwt = this.jwtService.sign(payload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRATION')),
    );
    return {
      jwt,
      expires,
    };
  }
}
