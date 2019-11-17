import { DataClient, DataClientOptions } from './types';

export const createDataClient = (options: DataClientOptions = {}): DataClient => {
  const { ssr, initialCache, headers } = options;

  return {
    cache: initialCache ? { ...initialCache } : {},
    pendingPromiseFactories: [],
    ssr: ssr || false,
    headers: headers || {},
    toBePrefetched: {},
  }
}