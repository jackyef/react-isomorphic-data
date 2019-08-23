import * as React from 'react';

import { DataContext } from '../common';
import qsify from '../utils/querystringify.js';

type AsyncDataState = {
  data: any;
  error: Error | boolean | null;
  loading: boolean;
};

type AsyncDataHookState = {
  error: Error | boolean | null;
  loading: boolean;
};

const useAsyncData = (url: string, queryParams: Record<string, any>, fetchOptions: RequestInit = {}): AsyncDataState => {
  // fetchOptions rarely changes. So let's just store it into a ref
  const optionsRef = React.useRef<RequestInit>(fetchOptions);
  const { cache, addToCache } = React.useContext(DataContext);

  const queryString = qsify(queryParams, '?');
  const fullUrl = `${url}${queryString}`;
  const dataFromCache = cache[fullUrl];
  const [state, setState] = React.useState<AsyncDataHookState>({
    error: null,
    loading: dataFromCache ? false : true,
  });

  React.useEffect(() => {
    if (typeof dataFromCache === 'undefined') {
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

  return {
    ...state,
    data: dataFromCache || null,
  };
};

export default useAsyncData;
