import * as React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { useDataClient } from '../hooks';

const withDataClient = ({ name = '' }: { name: string }) => {
  if (!name && process.env.NODE_ENV !== 'production') {
    console.warn('No `name` is passed to `withDataClient` HOC, defaulting to `client`. Please provide a name to avoid props name collision!');
  }

  return (Component: React.ElementType) => {
    return hoistNonReactStatics((props: any) => {
      const client = useDataClient();
      const dataProps = {
        [name || 'client']: client,
      };

      return <Component {...props} {...dataProps} />;
    }, Component);
  };
};

export default withDataClient;
