import { DataClient } from '../types';
import { DataHookOptions } from '../../hooks/types';

// returns an array of FetchOptions and string of fetchPolicy
const createFetchOptions = (
  fetchOptions: RequestInit,
  client: DataClient,
  dataOpts: DataHookOptions,
  lazy = false,
): [RequestInit, string] => {
  const finalMethod = fetchOptions.method && lazy ? fetchOptions.method : 'GET';

  let fetchPolicy = 'cache-first';
  if (dataOpts.fetchPolicy !== undefined) {
    fetchPolicy = dataOpts.fetchPolicy;
  } else if (client.fetchPolicy !== undefined) {
    fetchPolicy = client.fetchPolicy;
  }

  const ssrOpt = dataOpts.ssr !== undefined ? dataOpts.ssr : true;
  const isSSR = client.ssr && ssrOpt && typeof window === 'undefined';

  if (finalMethod !== 'GET') fetchPolicy = 'network-only';
  if (isSSR || client.test) fetchPolicy = 'cache-first';

  return [
    {
      ...fetchOptions,
      // only allow non-GET request for lazy requests, because non-GET request can be not idempotent
      method: finalMethod,
      headers: {
        ...client.headers, // add the base headers added when creating the DataClient
        ...fetchOptions.headers, // append other headers specific to this fetch
      },
    },
    fetchPolicy,
  ];
};

export default createFetchOptions;
