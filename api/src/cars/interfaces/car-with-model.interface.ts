import { Prisma } from '@prisma/client';

export type CarWithModel = Prisma.CarGetPayload<{
  include: { model: true };
}>;
