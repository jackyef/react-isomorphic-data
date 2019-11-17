
export interface DataClient {
  cache: Record<string, any>;
  pendingPromiseFactories: { () : Promise<any> }[];
  toBePrefetched: Record<string, boolean>;
  ssr: boolean;
  headers: Record<string, any>;
}

export interface DataClientOptions {
  ssr?: boolean;
  initialCache?: Record<string, any>;
  headers?: Record<string, any>;
}

export interface DataContextAPI {
  client: DataClient;
  addToCache: (key: string, value: any) => void;
  addToBePrefetched: (url: string) => void;
}