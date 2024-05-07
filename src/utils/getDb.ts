import { PrismaClient } from '@prisma/client';

export const getDb = (): PrismaClient => {
  return new PrismaClient();
}
