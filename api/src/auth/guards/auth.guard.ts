import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

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
      throw new UnauthorizedException('No token provided');
    }

    try {
      const userPayload = this.jwtService.verify<UserPayload>(token, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      });

      request.user = userPayload;

      return !!userPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
