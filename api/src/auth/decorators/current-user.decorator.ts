import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../interfaces/user-payload.interface';
import { CustomRequest } from '../interfaces/custom-request.interface';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    return request.user;
  },
);
