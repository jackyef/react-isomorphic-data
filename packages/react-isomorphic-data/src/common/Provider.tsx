import * as React from 'react';

import DataContext from './Context';
import normalisedAddToCache from './utils/addToCache';
import { DataClient, DataContextAPI } from './types';

interface DataProviderProps {
  children: JSX.Element[] | JSX.Element;
  client: DataClient;
}

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const [cache, setCache] = React.useState<Record<string, any>>(client.cache);
  const { toBePrefetched } = client;

  const addToBePrefetched = React.useCallback((url: string) => {
    toBePrefetched[url] = true;
  }, [toBePrefetched]);

  const addToCache = (key: string, value: any) => {
    if (client.ssr) {
      normalisedAddToCache(client.cache, key, value);
    }

    setCache(prevCache => {
      const newCache = { ...prevCache };
      
      return normalisedAddToCache(newCache, key, value);
    });
  };

  const injectedValues: DataContextAPI = {
    client: {
      ...client,
      cache,
    },
    addToCache,
    addToBePrefetched,
  };

  return <DataContext.Provider value={injectedValues}>{children}</DataContext.Provider>;
};

export default DataProvider;
