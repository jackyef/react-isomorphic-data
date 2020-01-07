import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useData } from '../hooks';

import { HocOptions } from './types';

const withData = <T, >(options: HocOptions) => {
  const { url, name, queryParams = {}, fetchOptions = {}, dataOptions } = options;

  if (!name && process.env.NODE_ENV !== 'production') {
    console.warn('No `name` is passed to `withData` HOC, defaulting to `data`. Please provide a name to avoid props name collision!');
  }

  const Wrapped = (Component: React.ComponentType<any>) => {
    const NewComp: React.SFC = (props: any) => {
      const baseData = useData<T>(url, queryParams, fetchOptions, dataOptions);
      const dataProps = {
        [name || 'data']: baseData,
      };

      return <Component {...props} {...dataProps} />;
    }

    NewComp.displayName = `withData(${Component.displayName || Component.name || 'Component'})`;
    
    return hoistNonReactStatics(NewComp, Component);
  };


  return Wrapped;
};

export default withData;
