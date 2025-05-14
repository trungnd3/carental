import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './interfaces/user-payload.interface';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from './users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const body = req.body as LoginDto;

    const user = await this.authService.verifyUser(body);

    const payload: UserPayload = {
      userId: user.id,
      email: user.email,
      licenseValidTo: user.licenseValidTo,
    };

    const signedJwt = this.jwtService.sign(payload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRATION')),
    );
    console.log(signedJwt);

    res.cookie('Authorization', signedJwt, {
      path: '/',
      httpOnly: true,
      secure: false,
      expires,
    });
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() userPayload: UserPayload) {
    return this.usersService.findOne({ email: userPayload.email });
  }
}
