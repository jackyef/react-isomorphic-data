import * as React from 'react';
import { DataContext } from '../../common';
import qsify from '../../utils/querystringify.js';

import { AsyncDataHookState, LazyAsyncDataState, DataHookOptions } from '../types';

const LoadingSymbol = Symbol('LoadingFlag');

const useBaseData = (
  url: string,
  queryParams: Record<string, any>,
  fetchOptions: RequestInit = {},
  lazy = false,
  dataOpts: DataHookOptions = {},
): LazyAsyncDataState => {
  const ssrOpt = dataOpts.ssr !== undefined ? dataOpts.ssr : true;
  const finalMethod = fetchOptions.method && lazy ? fetchOptions.method : 'GET';
  let fetchPolicy = dataOpts.fetchPolicy !== undefined ? dataOpts.fetchPolicy : 'cache-first';

  const promisePushed = React.useRef<boolean>(false);
  const fetchedFromNetwork = React.useRef<boolean>(false);
  const { client, addToCache } = React.useContext(DataContext);
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
  const dataFromCache = cache[fullUrl];

  let initialLoading = lazy ? false : true;

  if (dataFromCache && dataFromCache !== LoadingSymbol) {
    initialLoading = false;
  }

  const [state, setState] = React.useState<AsyncDataHookState>({
    error: null,
    loading: initialLoading,
    tempData: null, // store data from non-GET requests
  });

  const fetchData = async (): Promise<any> => {
    const createFetch = () =>
      fetch(fullUrl, optionsRef.current)
        .then(result => result.json())
        .then(json => {
          if (!useTempData) {
            // only cache response for GET requests
            // AND non 'network-only' requests
            addToCache(fullUrl, json);
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
        .catch(err => {
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

    if (cache[fullUrl] === undefined) {
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

    return new Promise(resolve => resolve());
  };

  const memoizedFetchData = React.useCallback(fetchData, [dataFromCache, fullUrl, addToCache]);

  // if this is ssr mode
  if (isSSR && !promisePushed.current) {
    if (!lazy && !dataFromCache) {
      client.pendingPromiseFactories.push(fetchData);
      promisePushed.current = true;
    }
  }

  React.useEffect(() => {
    if (!lazy && dataFromCache !== LoadingSymbol) {
      memoizedFetchData();
    }
  }, [lazy, memoizedFetchData, dataFromCache]);

  const finalData = dataFromCache !== LoadingSymbol ? dataFromCache : null;

  return [
    memoizedFetchData,
    {
      error: state.error,
      loading: state.loading,
      data: (!useTempData ? finalData : state.tempData) || null,
    },
  ];
};

export default useBaseData;
