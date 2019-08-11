import * as React from 'react';

import qsify from '../utils/querystringify.js';

interface PropsMapper {
  (resolvedValue: any): any;
}

interface AsyncDataState {
  data: any,
  error: Error | boolean | null,
  loading: boolean,
}

const useAsyncData = (url: string, queryParams: Object, mapResultToProps: PropsMapper): AsyncDataState => {
  const queryString = qsify(queryParams, '?');
  const [state, setState] = React.useState<AsyncDataState>({
    data: null,
    error: null,
    loading: true,
  });

  React.useEffect(() => {
    fetch(`${url}${queryString}`)
      .then(result => result.json())
      .then(json => {
        const data = mapResultToProps(json);

        setState({
          data,
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
