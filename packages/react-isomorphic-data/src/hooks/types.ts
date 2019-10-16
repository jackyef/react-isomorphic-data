export interface AsyncDataState {
  data: any;
  error: Error | boolean | null;
  loading: boolean;
};

export interface AsyncDataHookState {
  error: Error | null;
  loading: boolean;
  tempData: any;
};

export type LazyAsyncDataState = [
  () => Promise<any> | void,
  AsyncDataState,
];
