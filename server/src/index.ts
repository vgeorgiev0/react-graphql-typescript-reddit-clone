import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { GraphQLScalarType } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';
import * as tq from 'type-graphql';
import { Context, context, redisStore } from './context';
import {
  PostCreateInput,
  PostResolver,
  SortOrder,
} from './db/gql/resolvers/PostResolver';
import { UserResolver } from './db/gql/resolvers/UserResolver';
import session from 'express-session';
import { __prod__ } from './constants';

const serverPort = Number(process.env.SERVER_PORT) || 4000;

const main = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  tq.registerEnumType(SortOrder, {
    name: 'SortOrder',
  });

  const schema = await tq.buildSchema({
    resolvers: [PostResolver, UserResolver, PostCreateInput],
    scalarsMap: [{ type: GraphQLScalarType, scalar: DateTimeResolver }],
    validate: { forbidUnknownValues: false },
  });

  const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    cache: new InMemoryLRUCache(),
  });

  await server.start();

  app.use(
    '/graphql',
    session({
      name: 'qid',
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: process.env.REDIS_SECRET || 'assadqwejhkjqbwrmqejklajlkdjqw',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
    }),
    cors<cors.CorsRequest>({
      origin: [
        `http://localhost:${serverPort}`,
        `http://localhost:3000`,
        `http://localhost:${serverPort}/graphql`,
      ],
      credentials: true,
    }),
    express.json(),
    // @ts-expect-error
    expressMiddleware(server, {
      context: async ({ req, res }: { req: Request; res: Response }) => {
        return context({ req, res });
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: serverPort }, resolve)
  );

  app.get('/', (_, res) => {
    res.send('Hello World!');
  });

  console.log(`🚀 Server ready at http://localhost:${serverPort}/graphql`);
};

main();
