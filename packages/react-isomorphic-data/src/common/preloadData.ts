import createFetchRequirements from './utils/createFetchRequirements';
import { DataClient } from './types';
import { DataHookOptions } from '../hooks/types';
import qsify from '../utils/querystringify/querystringify.js';

/**
 * Simple cache for preloaded data
 */
const preloadCache: Record<string, any> = {};
const preloadJsonCache: Record<string, any> = {};

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
  const [finalFetchOpts, fetchPolicy] = createFetchRequirements(fetchOptions, client, dataOpts);
  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;

  let data: any = preloadCache[fullUrl];
  let fulfilled = data !== undefined;
  let error: Error | null = null;

  const promise = !data
    ? fetch(fullUrl, finalFetchOpts)
        .then((result) => result.text())
        .then((resText) => {
          data = resText;

          if (fetchPolicy !== 'network-only') {
            preloadCache[fullUrl] = resText;
          }
          
          fulfilled = true;
        })
        .catch((e) => (error = e))
    : new Promise((resolve) => {

      fulfilled = true;
      resolve();
    });

  const read = () => {
    if (error !== null) {
      // let an ErrorBoundary catch this
      throw error;
    } else if (!fulfilled && promise instanceof Promise) {
      // let a SuspenseBoundary catch this
      throw promise;
    } else {
      if (dataOpts.raw) {
        return data;
      } else {
        if (!preloadJsonCache[data]) {
          preloadJsonCache[data] = JSON.parse(data);
        }

        return preloadJsonCache[data];
      }
    }
  };

  return {
    read,
  };
};

export default preloadData;
