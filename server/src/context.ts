import { ExpressMiddlewareOptions } from '@apollo/server/dist/esm/express4';
import { PrismaClient } from '@prisma/client';
import { RedisStore } from 'connect-redis';
import { Request, Response } from 'express';
import { createClient } from 'redis';

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  req: Request;
  res: Response;
}

export const context = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Context => {
  return { prisma, req, res };
};

// Redis
// Initialize client.
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
export const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:',
  disableTouch: true,
  // disableTTL: true,
});
