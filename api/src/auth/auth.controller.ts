import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const body = req.body as LoginDto;

    const user = await this.authService.verifyUser(body);

    const payload = {
      email: user.email,
    };

    const signedJwt = this.jwtService.sign(payload);

    res.cookie('Authorization', signedJwt, {
      httpOnly: true,
    });
  }
}
