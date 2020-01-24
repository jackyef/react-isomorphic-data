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
  // const prevRef = React.useRef<any>();
  // prevRef.current = client;


  console.log('DataProvider rerender');

  // React.useEffect(() => {
  //   // all same.. why did we re-render then?
  //   console.log('client same?', prevRef.current.client === client);
  //   console.log('children same?', prevRef.current.children === children);

  //   prevRef.current.client = client;
  //   prevRef.current.children = children;
  // })

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
        // setNumber((prev) => prev + 1);
      }
    },
    [client.cache, client.ssr],
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
