import { unstable_batchedUpdates } from 'react-dom'; // eslint-disable-line
import { DataClient, DataClientOptions } from './types';

export const createDataClient = (
  options: DataClientOptions = {},
): DataClient => {
  const { ssr, initialCache, headers, test, ssrForceFetchDelay } = options;
  const subscribers: Record<string, Map<Function, Function>> = {};

  return {
    cache: initialCache ? { ...initialCache } : {},
    ssr: ssr || false,
    ssrForceFetchDelay: ssrForceFetchDelay || 0,
    ssrForceFetchDelayTimer: Date.now(),
    test: test || false,
    headers: headers || {},
    toBePrefetched: {},
    addSubscriber: (key: string, callback: Function) => {
      if (!(subscribers[key] instanceof Map)) {
        subscribers[key] = new Map();
      }

      subscribers[key].set(callback, callback);
    },
    removeSubscriber: (key: string, callback: Function) => {
      subscribers[key].delete(callback);
    },
    notifySubscribers: (key: string) => {
      unstable_batchedUpdates(() => {
        subscribers[key].forEach((callback) => {
          callback();
        });
      });
    },
  };
};
