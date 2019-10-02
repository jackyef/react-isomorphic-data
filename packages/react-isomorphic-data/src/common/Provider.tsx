import * as React from 'react';

import DataContext from './Context';

import { DataClient, DataContextAPI } from './types';

/**
 * We only cache GET requests, because deep checking request body on POST request is not ideal.
 */
interface DataProviderProps {
  children: JSX.Element[] | JSX.Element;
  client: DataClient;
}

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const [cache, setCache] = React.useState<Record<string, any>>(client.cache);

  const addToCache = (key: string, value: any) => {
    if (client.ssr) {
      client.cache = {
        ...cache,
        [key]: value,
      };
    }

    setCache(prevCache => ({
      ...prevCache,
      [key]: value,
    }));
  };

  const injectedValues: DataContextAPI = {
    client: {
      ...client,
      cache,
    },
    addToCache,
  };

  return <DataContext.Provider value={injectedValues}>{children}</DataContext.Provider>;
};

export default DataProvider;
