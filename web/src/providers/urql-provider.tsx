'use client';

import {
  UrqlProvider,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  createClient,
  OperationResult,
  TypedDocumentNode,
  AnyVariables,
} from '@urql/next';
import { registerUrql } from '@urql/next/rsc';
import { PropsWithChildren, useMemo } from 'react';

const makeClient = () => {
  return createClient({
    url: 'http://localhost:3050/graphql',
    exchanges: [cacheExchange, fetchExchange],
  });
};

export const client = makeClient();
export const { getClient } = registerUrql(makeClient);

export const gqlRequest = async (
  query: TypedDocumentNode<any, AnyVariables>
): Promise<OperationResult<any, {}> | null> => {
  try {
    const result = await getClient().query(query, {});
    return result;
  } catch (error) {
    console.error(error, 'urql provider');
  }
  return null;
};

const Provider = ({ children }: PropsWithChildren) => {
  const [client, ssr] = useMemo(() => {
    const ssr = ssrExchange({
      isClient: typeof window !== 'undefined',
    });
    const client = createClient({
      url: 'http://localhost:3050/graphql',
      exchanges: [cacheExchange, ssr, fetchExchange],
      suspense: true,
    });

    return [client, ssr];
  }, []);
  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
};

export default Provider;
