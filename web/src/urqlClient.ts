import {
  createClient,
  ssrExchange,
  cacheExchange,
  fetchExchange,
  debugExchange,
} from 'urql';

const isServerSide = typeof window === 'undefined';

const ssrCache = ssrExchange({ isClient: !isServerSide });

const client = createClient({
  url: 'http://localhost:3050/graphql',
  exchanges: [ssrCache, cacheExchange, fetchExchange, debugExchange],
  suspense: true,
  fetchOptions: () => {
    return {
      credentials: 'include',
      headers: {},
      cache: 'no-store',
    };
  },
});

export { client, ssrCache };
