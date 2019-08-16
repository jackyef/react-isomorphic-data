import * as React from 'react';

import qsify from '../utils/querystringify.js';

type AsyncDataState = {
  data: any;
  error: Error | boolean | null;
  loading: boolean;
};

const useAsyncData = (
  url: string,
  queryParams: Record<string, any>,
  fetchOptions: RequestInit = {},
): AsyncDataState => {
  // fetchOptions rarely changes. So let's just store it into a ref
  const optionsRef = React.useRef<RequestInit>(fetchOptions);

  const queryString = qsify(queryParams, '?');
  const [state, setState] = React.useState<AsyncDataState>({
    data: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    fetch(`${url}${queryString}`, optionsRef.current)
      .then(result => result.json())
      .then(json => {
        setState({
          data: json,
          error: false,
          loading: false,
        });
      })
      .catch(err => {
        setState({
          data: null,
          error: err,
          loading: false,
        });
      });
  }, [url, queryString]);

  return state;
};

export default useAsyncData;
