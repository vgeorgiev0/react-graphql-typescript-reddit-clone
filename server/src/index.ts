import 'reflect-metadata';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { GraphQLScalarType } from 'graphql';
import { DateTimeResolver } from 'graphql-scalars';
import * as tq from 'type-graphql';
import { Context, context } from './context';
import {
  PostCreateInput,
  PostResolver,
  SortOrder,
} from '../resolvers/PostResolver';
import { UserResolver } from '../resolvers/UserResolver';
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
  });
  await server.start();
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    // @ts-ignore
    expressMiddleware(server, {
      context: async ({
        req,
        res,
      }: {
        req: express.Request;
        res: express.Response;
      }) => {
        // @ts-ignore
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

  //   const { url } = await startStandaloneServer(server, {
  //     context: async () => context,
  //     listen: { port: serverPort },
  //   });

  //   console.log(`
  // 🚀 Server ready at: ${url}
  // ⭐️  See sample queries: http://pris.ly/e/ts/graphql-typegraphql#using-the-graphql-api`);
};

main();
