import { Request } from 'express';
import { UserPayload } from './user-payload.interface';

export interface CustomRequest extends Request {
  cookies: Record<string, string>;
  user: UserPayload;
}
