import * as React from 'react';
import { unstable_batchedUpdates } from 'react-dom'; // eslint-disable-line
import qsify from '../../utils/querystringify/querystringify.js';

import { LazyDataState, DataHookOptions } from '../types';
import useFetchRequirements from './useFetchRequirements';
import useCacheSubscription, { LoadingSymbol } from './useCacheSubscription';

const useBaseData = <T, > (
  url: string,
  queryParams: Record<string, any> = {},
  fetchOptions: RequestInit = {},
  lazy = false,
  dataOpts: DataHookOptions = {},
): LazyDataState<T> => {
  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;
  
  const ssrOpt = dataOpts.ssr !== undefined ? dataOpts.ssr : true;
  const skip = dataOpts.skip !== undefined ? dataOpts.skip : false;
  
  const { 
    client,
    addToCache,
    addToBePrefetched,
    retrieveFromCache,
    fetcher,
    dataFromCache,
    dataHookState: state,
    setDataHookState: setState,
  } = useCacheSubscription(fullUrl, lazy, skip);
  const [finalFetchOpts, fetchPolicy] = useFetchRequirements(fetchOptions, client, dataOpts, lazy);
  
  // add `<link rel="prefetch" /> tag for the resource only if it's enabled by user and the query isn't fetched during ssr
  const shouldPrefetch = dataOpts.prefetch !== undefined ? dataOpts.prefetch && (!ssrOpt || lazy) : false;

  const promiseRef = React.useRef<Promise<any> | null>(null);
  const promisePushed = React.useRef<boolean>(false);
  const fetchedFromNetwork = React.useRef<boolean>(false);

  const isSSR = client.ssr && ssrOpt && typeof window === 'undefined';
  const useTempData = finalFetchOpts.method !== 'GET' || fetchPolicy === 'network-only';

  const createFetch = React.useCallback(() => {
    promiseRef.current = fetcher(fullUrl, finalFetchOpts)
      .then((result) => result.json())
      .then((json) => {
        // this block of code will cause 2 re-renders because React doesn't batch these 2 updates
        // https://twitter.com/dan_abramov/status/887963264335872000?lang=en
        // For React 16.x we can use `unstable_batchedUpdates()` to solve this
        unstable_batchedUpdates(() => {
          if (!useTempData) {
            // only cache response for GET requests
            // AND non 'network-only' requests
            addToCache(fullUrl, json);
          } else {
            // resets the cache to 'undefined'
            addToCache(fullUrl, undefined);
          }

          if (!isSSR) {
            setState((prev: any) => ({
              ...prev,
              tempCache: { ...prev.tempCache, [fullUrl]: json },
              error: { ...prev.error, [fullUrl]: undefined },
            }));
          }
        });

        return json;
      })
      .catch((err) => {
        if (!isSSR) {
          // sets the state accordingly
          unstable_batchedUpdates(() => {
            setState((prev: any) => ({
              ...prev,
              error: {
                ...prev.error,
                [fullUrl]: err,
              },
            }));
  
            // resets the cache to 'undefined'
            addToCache(fullUrl, undefined);
          });
        } else {
          // throw an error during SSR
          throw err;
        }
      });

    return promiseRef.current;
  }, [addToCache, finalFetchOpts, fullUrl, isSSR, useTempData, fetcher, setState]);

  const memoizedFetchData = React.useCallback((): Promise<any> => {
    const currentDataInCache = retrieveFromCache(fullUrl);
    
    // data not in cache yet
    if (currentDataInCache === undefined && !state.tempCache[fullUrl]) {
      addToCache(fullUrl, LoadingSymbol); // Use the loading flag as value temporarily

      fetchedFromNetwork.current = true;

      return createFetch();
    }

    // data is already in cache
    if (fetchPolicy !== 'cache-first') {
      // fetch again 1 time for cache-and-network cases
      // not that we do not set the cache to LoadingSymbol here,
      // this is so the component can reuse previous response while the new request is in progress
      if (!fetchedFromNetwork.current || lazy) {
        fetchedFromNetwork.current = true;
        
        return createFetch();
      }
    }
    
    return new Promise((resolve) => resolve(currentDataInCache || state.tempCache[fullUrl]));
  }, [
    lazy,
    state.tempCache,
    createFetch,
    fullUrl,
    addToCache,
    fetchPolicy,
    retrieveFromCache,
  ]);

  // if this data is supposed to be fetched during SSR
  if (isSSR) {
    if (!promisePushed.current && !lazy && !dataFromCache) {
      client.pendingPromiseFactories.push(memoizedFetchData);
      promisePushed.current = true;
    }
  }

  // if the DataClient instance we are using is in ssr mode
  if (client.ssr) {
    if (shouldPrefetch) {
      addToBePrefetched(fullUrl);
    }
  }

  React.useEffect(() => {
    if (!lazy && !skip) {
      // !promiseRef.current ensure that the fetch is at least fired once.
      if ((dataFromCache !== LoadingSymbol && !state.error?.[fullUrl]) || !promiseRef.current) {
        memoizedFetchData();
      }
    }
  }, [skip, lazy, memoizedFetchData, dataFromCache, state.error, fullUrl]);

  const finalData = dataFromCache !== LoadingSymbol ? dataFromCache : null;
  const usedData = (!useTempData ? finalData : state.tempCache[fullUrl]) || null;
  const isLoading = dataFromCache === LoadingSymbol || (client.ssr && typeof dataFromCache === 'undefined' && !lazy);

  return [
    memoizedFetchData,
    {
      error: state.error?.[fullUrl] || null,
      loading: isLoading,
      data: usedData,
      refetch: () => {
        // always reset cache on refetch
        addToCache(fullUrl, LoadingSymbol); // Use the loading flag as value temporarily

        return createFetch();
       },
    },
  ];
};

export default useBaseData;
