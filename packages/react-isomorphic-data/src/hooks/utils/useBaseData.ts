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
  dataOpts: DataHookOptions = { ssr: true },
): LazyAsyncDataState => {
  const promisePushed = React.useRef<boolean>(false);
  const { client, addToCache } = React.useContext(DataContext);
  const { cache } = client;
  const finalMethod = fetchOptions.method && lazy ? fetchOptions.method : 'GET';
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

  const isSSR = client.ssr && dataOpts.ssr && typeof window === 'undefined';

  const fetchData = async (): Promise<any> => {
    if (typeof dataFromCache === 'undefined') {
      setState(prev => ({ ...prev, loading: true }));
      addToCache(fullUrl, LoadingSymbol); // Use the loading flag as value temporarily

      return fetch(fullUrl, optionsRef.current)
        .then(result => result.json())
        .then(json => {
          if (!fetchOptions.method || fetchOptions.method === 'GET') {
            // only cache response for GET requests
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
    if (!lazy) {
      memoizedFetchData();
    }
  }, [lazy, memoizedFetchData]);

  const finalData = dataFromCache === LoadingSymbol ? null : dataFromCache;

  return [
    memoizedFetchData,
    {
      error: state.error,
      loading: state.loading,
      data: finalMethod === 'GET' ? finalData : state.tempData,
    },
  ];
};

export default useBaseData;
