import { DataClient, DataClientOptions } from './types';

export const createDataClient = (options: DataClientOptions = {}): DataClient => {
  const { ssr, initialCache } = options;

  return {
    cache: initialCache ? { ...initialCache } : {},
    pendingPromises: [],
    ssr: ssr || false,
  }
}