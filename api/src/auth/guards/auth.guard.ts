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

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();

    if (!request.cookies || !request.cookies?.Authorization) {
      return false;
    }

    const userPayload = this.jwtService.verify<UserPayload>(
      request.cookies.Authorization,
      {
        secret: this.configService.getOrThrow('JWT_SECRET'),
      },
    );

    request.user = userPayload;

    return !!userPayload;
  }
}
