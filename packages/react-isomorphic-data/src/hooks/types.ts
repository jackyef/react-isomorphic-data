export interface DataState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<T>;
};

export interface DataHookState {
  error: Record<string, Error | null>;
  loading: boolean;
  tempCache: any;
};

export type LazyDataState<T> = [
  () => Promise<T> | void,
  DataState<T>,
];

export interface DataHookOptions {
  ssr?: boolean;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only';
  prefetch?: boolean;
  skip?: boolean;
  raw?: boolean;
};
