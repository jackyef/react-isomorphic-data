import * as React from 'react';

import DataContext from './Context';
import normalisedAddToCache from './utils/addToCache';
import _retrieveFromCache from './utils/retrieveFromCache';
import { DataClient, DataContextAPI } from './types';

interface DataProviderProps {
  children: JSX.Element[] | JSX.Element;
  client: DataClient;
}

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const [, setNumber] = React.useState<number>(0);
  const { toBePrefetched } = client;

  const addToBePrefetched = React.useCallback((url: string) => {
    toBePrefetched[url] = true;
  }, [toBePrefetched]);

  const addToCache = React.useCallback((key: string, value: any) => {
    normalisedAddToCache(client.cache, key, value);

    if (!client.ssr) {
      // force an update
      setNumber(prev => prev + 1);
    }
  }, [client.cache, client.ssr]);

  const retrieveFromCache = (url: string) => {
    return _retrieveFromCache(client.cache, url);
  }

  const injectedValues: DataContextAPI = {
    client,
    addToCache,
    addToBePrefetched,
    retrieveFromCache,
    fetcher: fetch,
  };

  return <DataContext.Provider value={injectedValues}>{children}</DataContext.Provider>;
};

export default DataProvider;
