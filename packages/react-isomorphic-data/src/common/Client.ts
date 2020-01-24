import { DataClient, DataClientOptions } from './types';

export const createDataClient = (
  options: DataClientOptions = {},
): DataClient => {
  const { ssr, initialCache, headers, test } = options;
  const subscribers: Record<string, Function | null> = {};

  return {
    cache: initialCache ? { ...initialCache } : {},
    pendingPromiseFactories: [],
    ssr: ssr || false,
    test: test || false,
    headers: headers || {},
    toBePrefetched: {},
    addSubscriber: (key: string, callback: Function) => {
      subscribers[key] = callback;
    },
    removeSubscriber: (key: string) => {
      delete subscribers[key];
    },
  };
};
