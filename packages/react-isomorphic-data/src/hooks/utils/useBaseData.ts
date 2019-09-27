import * as React from 'react';
import { DataContext } from '../../common';
import qsify from '../../utils/querystringify.js';

import { AsyncDataHookState, LazyAsyncDataState } from '../types';

const useBaseData = (url: string, queryParams: Record<string, any>, fetchOptions: RequestInit = {}, lazy = false): LazyAsyncDataState => {
  // fetchOptions rarely changes. So let's just store it into a ref
  const optionsRef = React.useRef<RequestInit>(fetchOptions);
  const { cache, addToCache } = React.useContext(DataContext);

  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;
  const dataFromCache = cache[fullUrl];
  const [state, setState] = React.useState<AsyncDataHookState>({
    error: null,
    loading: false,
  });

  const fetchData = React.useCallback(() => {
    if (typeof dataFromCache === 'undefined') {
      setState(prev => ({ ...prev, loading: true }));

      fetch(fullUrl, optionsRef.current)
        .then(result => result.json())
        .then(json => {
          addToCache(fullUrl, json);
          setState({
            error: false,
            loading: false,
          });
        })
        .catch(err => {
          setState({
            error: err,
            loading: false,
          });
        });
    }
  }, [dataFromCache, fullUrl, addToCache]);

  React.useEffect(() => {
    if (!lazy) {
      fetchData();
    }
  }, [lazy, fetchData]);

  return [
    fetchData,
    {
      error: state.error,
      loading: state.loading,
      data: dataFromCache || null,
    },
  ];
};

export default useBaseData;
