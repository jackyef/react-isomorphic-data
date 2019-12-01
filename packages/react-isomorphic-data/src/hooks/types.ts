export interface DataState {
  data: any;
  error: Error | null;
  loading: boolean;
  refetch: () => Promise<any>;
};

export interface DataHookState {
  error: Record<string, Error | null>;
  loading: boolean;
  tempCache: any;
};

export type LazyDataState = [
  () => Promise<any> | void,
  DataState,
];

export interface DataHookOptions {
  ssr?: boolean;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only';
  prefetch?: boolean;
  skip?: boolean;
};
