import createFetchRequirements from './utils/createFetchRequirements';
import { DataClient } from './types';
import { DataHookOptions } from '../hooks/types';
import qsify from '../utils/querystringify.js';

/**
 * Simple cache for preloaded data
 */
const preloadCache: Record<string, any> = {};

/**
 * An imperative API to preload data to implement render-as-you-fetch pattern
 */
const preloadData = (
  client: DataClient,
  url: string,
  queryParams: Record<string, any> = {},
  fetchOptions: RequestInit = {},
  dataOpts: DataHookOptions = {},
) => {
  const [finalFetchOpts] = createFetchRequirements(fetchOptions, client, dataOpts);
  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;

  let data: any = preloadCache[fullUrl];
  let fulfilled = data !== undefined;
  let error: Error | null = null;

  const promise = !data
    ? fetch(fullUrl, finalFetchOpts)
        .then((result) => result.json())
        .then((json) => {
          data = json;
          preloadCache[fullUrl] = data;
          fulfilled = true;
        })
        .catch((e) => (error = e))
    : new Promise((resolve) => {

      fulfilled = true;
      resolve();
    });

  const read = () => {
    if (!fulfilled && promise instanceof Promise) {
      // let a SuspenseBoundary catch this
      throw promise;
    } else if (error !== null) {
      // let an ErrorBoundary catch this
      throw error;
    } else {
      return data;
    }
  };

  return {
    read,
  };
};

export default preloadData;
