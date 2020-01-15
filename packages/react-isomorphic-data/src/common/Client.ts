import { DataClient, DataClientOptions } from './types';

export const createDataClient = (options: DataClientOptions = {}): DataClient => {
  const { ssr, initialCache, headers, test } = options;

  return {
    cache: initialCache ? { ...initialCache } : {},
    pendingPromiseFactories: [],
    ssr: ssr || false,
    test: test || false,
    headers: headers || {},
    toBePrefetched: {},
  }
}