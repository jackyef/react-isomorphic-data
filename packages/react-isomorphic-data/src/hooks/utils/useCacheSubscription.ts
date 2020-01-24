import React from 'react';
import { DataContext, DataClient, createDataClient } from '../../common';

interface Subscription {
  listen: () => void;
  unlisten: () => void;
}

const subscribe = (key: string, callback: Function, client: DataClient): Subscription => {
  const listen = () => {
    // push the forceUpdate function to the cache's list of subscriber
    console.log('started listening..', { key });
    client.addSubscriber(key, callback);
  };

  const unlisten = () => {
    // remove from cache's list of subscriber
    console.log('stopped listening..', { key });
    client.removeSubscriber(key);
  };

  return {
    listen,
    unlisten,
  };
};

const DummyDataContext = React.createContext({
  client: createDataClient(),
  addToCache: (key: string) => true,
  addToBePrefetched: (key: string) => true,
  retrieveFromCache: (key: string) => ({}),
  fetcher: fetch,
})

/**
 * Create a subscription for the `string` key in the DataClient.cache
 */
const useCacheSubscription = (key: string) => {
  const context = React.useContext(DataContext);
  if (!context) throw new Error('DataContext is null. Make sure you are wrapping your app inside DataProvider');

  const { client, addToCache, addToBePrefetched, retrieveFromCache, fetcher } = context;
  const [, setState] = React.useState<number>(0);
  const prevRef = React.useRef<any>(context)

  const forceUpdate = React.useCallback(() => {
    console.log('forced to update', key);
    setState((prev) => prev + 1);
  }, [key]);

  console.log('useCacheSubscription rerender');

  React.useEffect(() => {
    // all same.. why did we re-render then?
    // console.log('client same?', prevRef.current.client === client);
    // console.log('addToCache same?', prevRef.current.addToCache === addToCache);
    // console.log('addToBePrefetched same?', prevRef.current.addToBePrefetched === addToBePrefetched);
    // console.log('retrieveFromCache same?', prevRef.current.retrieveFromCache === retrieveFromCache);
    // console.log('fetcher same?', prevRef.current.fetcher === fetcher);

    prevRef.current.client = client;
    prevRef.current.addTocache = addToCache;
    prevRef.current.addToBePrefetched = addToBePrefetched;
    prevRef.current.retrieveFromCache = retrieveFromCache;
    prevRef.current.fetcher = fetcher;
  })

  React.useLayoutEffect(() => {
    let subscription: Subscription | null = subscribe(key, forceUpdate, client);

    subscription.listen();

    return () => {
      if (subscription) subscription.unlisten();

      subscription = null;
    };
  }, [key, forceUpdate, client]);

  return {
    client,
    addToCache,
    addToBePrefetched,
    retrieveFromCache,
    fetcher,
  };
};

export default useCacheSubscription;
