export interface DataState {
  data: any;
  error: Error | boolean | null;
  loading: boolean;
  refetch: () => Promise<any>;
};

export interface DataHookState {
  error: Error | null;
  loading: boolean;
  tempData: any;
};

export type LazyDataState = [
  () => Promise<any> | void,
  DataState,
];

export interface DataHookOptions {
  ssr?: boolean;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only';
};
