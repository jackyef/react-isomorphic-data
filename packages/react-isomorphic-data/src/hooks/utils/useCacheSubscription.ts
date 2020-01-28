import React from 'react';
import { DataContext, DataClient } from '../../common';
import { DataHookState } from '../types';
import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

export const LoadingSymbol = Symbol('LoadingFlag');

interface Subscription {
  listen: () => void;
  unlisten: () => void;
}

const subscribe = (key: string, callback: Function, client: DataClient): Subscription => {
  const listen = () => {
    // add the forceUpdate function to the cache's list of subscribers
    client.addSubscriber(key, callback);
  };

  const unlisten = () => {
    // remove from cache's list of subscriber
    client.removeSubscriber(key, callback);
  };

  return {
    listen,
    unlisten,
  };
};

/**
 * Create a subscription for the `string` key in the DataClient.cache
 */
const useCacheSubscription = (key: string, lazy: boolean, skip: boolean) => {
  const context = React.useContext(DataContext);
  if (!context) throw new Error('DataContext is null. Make sure you are wrapping your app inside DataProvider');

  const { client, addToCache, addToBePrefetched, retrieveFromCache, fetcher } = context;
  const [, setState] = React.useState<number>(0);
  const dataFromCache = retrieveFromCache(key);

  let initialLoading = lazy || skip ? false : true;

  if (dataFromCache && dataFromCache !== LoadingSymbol) {
    initialLoading = false;
  }

  const [dataHookState, setDataHookState] = React.useState<DataHookState>({
    error: {},
    loading: initialLoading,
    tempCache: {}, // store data from non-GET requests
  });

  const forceUpdate = React.useCallback(() => {
    setState((prev) => prev + 1);
  }, []);

  useIsomorphicLayoutEffect(() => {
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
    dataFromCache,
    dataHookState,
    setDataHookState,
    fetcher,
  };
};

export default useCacheSubscription;
