import * as React from 'react';
import { DataContext } from '../../common';
import retrieveFromCache from '../../common/utils/retrieveFromCache';
import qsify from '../../utils/querystringify.js';

import { DataHookState, LazyDataState, DataHookOptions } from '../types';
import createResource from './createResource';

const LoadingSymbol = Symbol('LoadingFlag');

const useBaseData = (
  url: string,
  queryParams: Record<string, any> = {},
  fetchOptions: RequestInit = {},
  lazy = false,
  dataOpts: DataHookOptions = {},
): LazyDataState => {
  const ssrOpt = dataOpts.ssr !== undefined ? dataOpts.ssr : true;
  const finalMethod = fetchOptions.method && lazy ? fetchOptions.method : 'GET';
  let fetchPolicy = dataOpts.fetchPolicy !== undefined ? dataOpts.fetchPolicy : 'cache-first';

  // add `<link rel="prefetch" /> tag for the resource only if it's enabled by user and the query isn't fetched during ssr
  const shouldPrefetch = dataOpts.prefetch !== undefined ? dataOpts.prefetch && (!ssrOpt || lazy) : false;

  const promiseRef = React.useRef<Promise<any> | null>(null);
  const promisePushed = React.useRef<boolean>(false);
  const fetchedFromNetwork = React.useRef<boolean>(false);
  const { client, addToCache, addToBePrefetched } = React.useContext(DataContext);
  const { cache } = client;
  const isSSR = client.ssr && ssrOpt && typeof window === 'undefined';

  if (finalMethod !== 'GET') fetchPolicy = 'network-only';
  if (isSSR) fetchPolicy = 'cache-first';

  const useTempData = finalMethod !== 'GET' || fetchPolicy === 'network-only';

  // fetchOptions rarely changes. So let's just store it into a ref
  const optionsRef = React.useRef<RequestInit>({
    ...fetchOptions,
    // only allow non-GET request for lazy requests, because non-GET request can be not idempotent
    method: finalMethod,
    headers: {
      ...client.headers, // add the base headers added when creating the DataClient
      ...fetchOptions.headers, // append other headers specific to this fetch
    },
  });

  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;
  const dataFromCache = retrieveFromCache(cache, fullUrl);

  let initialLoading = false;

  if (dataFromCache && dataFromCache === LoadingSymbol || !lazy) {
    initialLoading = true;
  }

  const [state, setState] = React.useState<DataHookState>({
    error: null,
    loading: initialLoading,
    tempData: null, // store data from non-GET requests
  });

  const createFetch = () => {
    promiseRef.current = fetch(fullUrl, optionsRef.current)
      .then((result) => result.json())
      .then((json) => {
        if (!useTempData) {
          // only cache response for GET requests
          // AND non 'network-only' requests
          addToCache(fullUrl, json);
        } else {
          // resets the cache to 'undefined'
          addToCache(fullUrl, undefined);
        }

        if (!isSSR) {
          setState({
            error: null,
            loading: false,
            tempData: json,
          });
        }

        return json;
      })
      .catch((err) => {
        if (!isSSR) {
          setState({
            error: err,
            loading: false,
            tempData: null,
          });
        } else {
          // throw an error during SSR
          throw err;
        }
      });

    return promiseRef.current;
  };

  const fetchData = async (): Promise<any> => {
    const currentDataInCache = retrieveFromCache(cache, fullUrl);

    // data not in cache yet
    if (currentDataInCache === undefined && state.tempData === null) {
      setState(prev => ({ ...prev, loading: true }));
      addToCache(fullUrl, LoadingSymbol); // Use the loading flag as value temporarily
      
      fetchedFromNetwork.current = true;

      return createFetch();
    }

    // data is already in cache
    if (fetchPolicy !== 'cache-first') {
      // fetch again 1 time for cache-and-network cases
      if (!fetchedFromNetwork.current || lazy) {
        fetchedFromNetwork.current = true;

        return createFetch();
      }
    }

    return new Promise((resolve) => resolve());
  };

  const memoizedFetchData = React.useCallback(fetchData, [
    dataFromCache,
    fullUrl,
    addToCache,
    retrieveFromCache,
    fetchPolicy,
    state.tempData,
  ]);

  // if this data is supposed to be fetched during SSR
  if (isSSR) {
    if (!promisePushed.current && !lazy && !dataFromCache) {
      client.pendingPromiseFactories.push(fetchData);
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
    // !promiseRef.current ensure that the fetch is at least fired once.
    if (!lazy && dataFromCache !== LoadingSymbol && !state.loading || !promiseRef.current) {
      memoizedFetchData();
    }
  }, [lazy, memoizedFetchData, dataFromCache, state.loading]);

  const finalData = dataFromCache !== LoadingSymbol ? dataFromCache : null;
  const usedData = (!useTempData ? finalData : state.tempData) || null;
  const isLoading = dataFromCache === LoadingSymbol || state.loading;

  return [
    memoizedFetchData,
    {
      error: state.error,
      loading: isLoading,
      data: usedData,
      refetch: () => createFetch(), // always bypass cache on refetch
      resource: createResource(isLoading, usedData, promiseRef),
    },
  ];
};

export default useBaseData;
