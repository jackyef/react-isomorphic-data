import * as React from 'react';
import { DataContext } from '../../common';
import retrieveFromCache from '../../common/utils/retrieveFromCache';
import qsify from '../../utils/querystringify.js';

import { DataHookState, LazyDataState, DataHookOptions } from '../types';
import createFetchRequirements from '../../common/utils/createFetchRequirements';

const LoadingSymbol = Symbol('LoadingFlag');

const useBaseData = (
  url: string,
  queryParams: Record<string, any> = {},
  fetchOptions: RequestInit = {},
  lazy = false,
  dataOpts: DataHookOptions = {},
): LazyDataState => {
  const { client, addToCache, addToBePrefetched } = React.useContext(DataContext);
  const { cache } = client;

  const [finalFetchOpts, fetchPolicy] = createFetchRequirements(fetchOptions, client, dataOpts, lazy);

  const ssrOpt = dataOpts.ssr !== undefined ? dataOpts.ssr : true;

  // add `<link rel="prefetch" /> tag for the resource only if it's enabled by user and the query isn't fetched during ssr
  const shouldPrefetch = dataOpts.prefetch !== undefined ? dataOpts.prefetch && (!ssrOpt || lazy) : false;

  const promiseRef = React.useRef<Promise<any> | null>(null);
  const promisePushed = React.useRef<boolean>(false);
  const fetchedFromNetwork = React.useRef<boolean>(false);

  const isSSR = client.ssr && ssrOpt && typeof window === 'undefined';
  const useTempData = finalFetchOpts.method !== 'GET' || fetchPolicy === 'network-only';

  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;
  const dataFromCache = retrieveFromCache(cache, fullUrl);

  let initialLoading = lazy ? false : true;

  if (dataFromCache && dataFromCache !== LoadingSymbol) {
    initialLoading = false;
  }

  const [state, setState] = React.useState<DataHookState>({
    error: null,
    loading: initialLoading,
    tempData: null, // store data from non-GET requests
  });

  const createFetch = () => {
    promiseRef.current = fetch(fullUrl, finalFetchOpts)
      .then((result) => result.json())
      .then((json) => {
        // this block of code will cause 2 re-renders because React doesn't batch these 2 updates
        // https://twitter.com/dan_abramov/status/887963264335872000?lang=en
        // TODO: improve how we are handling the states so we only have 1 re-render

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
          // sets the state accordingly
          setState({
            error: err,
            loading: false,
            tempData: null,
          });

          // resets the cache to 'undefined'
          addToCache(fullUrl, undefined);
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
      setState((prev) => ({ ...prev, loading: true }));
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
    finalFetchOpts,
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
    if (!lazy) {
      // !promiseRef.current ensure that the fetch is at least fired once.
      if ((dataFromCache !== LoadingSymbol && !state.loading && !state.error) || !promiseRef.current) {
        memoizedFetchData();
      }
    }
  }, [lazy, memoizedFetchData, dataFromCache, state.loading, state.error]);

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
    },
  ];
};

export default useBaseData;
