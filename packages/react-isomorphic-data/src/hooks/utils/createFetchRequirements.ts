import { DataClient } from '../../common/types';
import { DataHookOptions } from '../types';

// returns an array of FetchOptions and string of fetchPolicy
const createFetchOptions = (
  fetchOptions: RequestInit,
  client: DataClient,
  dataOpts: DataHookOptions,
  lazy = false,
): [RequestInit, string] => {
  const finalMethod = fetchOptions.method && lazy ? fetchOptions.method : 'GET';
  let fetchPolicy = dataOpts.fetchPolicy !== undefined ? dataOpts.fetchPolicy : 'cache-first';
  const ssrOpt = dataOpts.ssr !== undefined ? dataOpts.ssr : true;
  const isSSR = client.ssr && ssrOpt && typeof window === 'undefined';

  if (finalMethod !== 'GET') fetchPolicy = 'network-only';
  if (isSSR) fetchPolicy = 'cache-first';

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
