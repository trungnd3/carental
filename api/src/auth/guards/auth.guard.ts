import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserPayload } from '../interfaces/user-payload.interface';
import { CustomRequest } from '../interfaces/custom-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    let token: string = '';
    if (request.cookies && request.cookies?.Authorization) {
      token = request.cookies.Authorization;
    }

    if (!token && request.headers && request.headers.authorization) {
      token = request.headers.authorization;
    }

    if (!token) {
      return false;
    }

    const userPayload = this.jwtService.verify<UserPayload>(token, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });

    request.user = userPayload;

    return !!userPayload;
  }
}
