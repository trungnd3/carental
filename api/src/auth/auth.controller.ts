import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { UserPayload } from './interfaces/user-payload.interface';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const body = req.body as LoginDto;

    const user = await this.authService.verifyUser(body);
    const signed = this.authService.signJwt(user);

    res.cookie('Authorization', signed.jwt, {
      path: '/',
      httpOnly: true,
      secure: false,
      expires: signed.expires,
    });
  }

  @Post('/register')
  async register(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const body = req.body as CreateUserDto;

    const user = await this.usersService.create(body);
    const signed = this.authService.signJwt(user);

    res.cookie('Authorization', signed.jwt, {
      path: '/',
      httpOnly: true,
      secure: false,
      expires: signed.expires,
    });
  }

  @Get('/current-user')
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() userPayload: UserPayload) {
    return this.usersService.findOne({ email: userPayload.email });
  }
}
