import * as React from 'react';
import { DataContext } from '../../common';
import qsify from '../../utils/querystringify.js';

import { AsyncDataHookState, LazyAsyncDataState } from '../types';

const useBaseData = (url: string, queryParams: Record<string, any>, fetchOptions: RequestInit = {}, lazy = false): LazyAsyncDataState => {
  // fetchOptions rarely changes. So let's just store it into a ref
  const promisePushed = React.useRef<boolean>(false);
  const optionsRef = React.useRef<RequestInit>(fetchOptions);
  const { client, addToCache } = React.useContext(DataContext);
  const { cache } = client;

  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;
  const dataFromCache = cache[fullUrl];
  const [state, setState] = React.useState<AsyncDataHookState>({
    error: null,
    loading: false,
  });

  const isSSR = client.ssr && typeof window === 'undefined';

  const fetchData = async (): Promise<any> => {
    if (typeof dataFromCache === 'undefined') {
      setState(prev => ({ ...prev, loading: true }));

      return fetch(fullUrl, optionsRef.current)
        .then(result => result.json())
        .then(json => {
          addToCache(fullUrl, json);

          if (!isSSR) {
            setState({
              error: false,
              loading: false,
            });
          }
        })
        .catch(err => {
          if (!isSSR) {
            setState({
              error: err,
              loading: false,
            });
          }
        });
    }

    return new Promise(resolve => resolve());
  }

  const memoizedFetchData = React.useCallback(fetchData, [dataFromCache, fullUrl, addToCache]);

  // if this is ssr mode
  if (isSSR && !promisePushed.current) {
    if (!lazy && !dataFromCache) {
      client.pendingPromises.push(fetchData());
      promisePushed.current = true;
    }
  }

  React.useEffect(() => {
    if (!lazy) {
      memoizedFetchData();
    }
  }, [lazy, memoizedFetchData]);

  return [
    memoizedFetchData,
    {
      error: state.error,
      loading: state.loading,
      data: dataFromCache || null,
    },
  ];
};

export default useBaseData;
