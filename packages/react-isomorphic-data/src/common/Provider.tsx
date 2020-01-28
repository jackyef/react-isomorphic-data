import * as React from 'react';

import DataContext from './Context';
import normalisedAddToCache from './utils/addToCache';
import _retrieveFromCache from './utils/retrieveFromCache';
import { DataClient, DataContextAPI } from './types';

/**
 * Implementation details note:
 * DataProvider is expected to NEVER re-render. react-isomorphic-data implement a subscriber pattern where
 * each hooks force an update for each component separately, instead of relying on React to automatically 
 * re-renders when the DataClient.cache is updated.
 * 
 * All update to the DataClient.cache is done in-place (not creating a new object everytime),
 * and the useCacheSubscription hook handle the force updates for each components.
 */

interface DataProviderProps {
  children: JSX.Element[] | JSX.Element;
  client: DataClient;
}

const DataProvider: React.FC<DataProviderProps> = ({ children, client }) => {
  const addToBePrefetched = React.useCallback(
    (url: string) => {
      client.toBePrefetched[url] = true;
    },
    [client.toBePrefetched],
  );

  const addToCache = React.useCallback(
    (key: string, value: any) => {
      normalisedAddToCache(client.cache, key, value);

      if (!client.ssr) {
        // force an update
        // notify all subscribers that listens for the same key
        // this will trigger an update/re-render for all affected hook
        client.notifySubscribers(key);
      }
    },
    [client],
  );

  const retrieveFromCache = React.useCallback(
    (url: string) => {
      return _retrieveFromCache(client.cache, url);
    },
    [client.cache],
  );

  const injectedValues: DataContextAPI = {
    client,
    addToCache,
    addToBePrefetched,
    retrieveFromCache,
    fetcher: fetch,
  };

  return (
    <DataContext.Provider value={injectedValues}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
