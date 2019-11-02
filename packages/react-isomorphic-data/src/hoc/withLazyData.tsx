import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useLazyData } from '../hooks';

import { HocOptions } from './types';

const withData = (options: HocOptions) => {
  const { url, name, queryParams = {}, fetchOptions = {}, dataOptions } = options;

  if (!name && process.env.NODE_ENV !== 'production') {
    console.warn('No `name` is passed to `withLazyData` HOC, defaulting to `data`. Please provide a name to avoid props name collision!');
  }

  return (Component: React.ElementType) => {
    return hoistNonReactStatics((props: any) => {
      const [load, { data, loading, error }] = useLazyData(url, queryParams, fetchOptions, dataOptions);
      const dataProps = {
        [name || 'data']: [
          load,
          {
            data,
            loading,
            error,
          },
        ],
      };

      return <Component {...props} {...dataProps} />;
    }, Component);
  };
};

export default withData;
