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
  fetchOptions: () => {
    return {
      credentials: 'include',
      headers: {},
    };
  },
});

export { client, ssrCache };
