export interface AsyncDataState {
  data: any;
  error: Error | boolean | null;
  loading: boolean;
};

export interface AsyncDataHookState {
  error: Error | boolean | null;
  loading: boolean;
};

export type LazyAsyncDataState = [
  () => Promise<any> | void,
  AsyncDataState,
];
