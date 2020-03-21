export interface DataResource {
  read: () => any;
};
export interface DataClient {
  cache: Record<string, any>;
  toBePrefetched: Record<string, boolean>;
  ssr: boolean;
  test: boolean;
  headers: Record<string, any>;
  addSubscriber: (key: string, callback: Function) => void;
  removeSubscriber: (key: string, callback: Function) => void;
  notifySubscribers: (key: string) => void;
}

export interface DataClientOptions {
  ssr?: boolean;
  test?: boolean;
  initialCache?: Record<string, any>;
  headers?: Record<string, any>;
}

export interface DataContextAPI {
  client: DataClient;
  addToCache: (key: string, value: any) => void;
  addToBePrefetched: (url: string) => void;
  retrieveFromCache: (url: string) => any;
  fetcher: (input: RequestInfo, init?: RequestInit) => Promise<Response | any>;
}