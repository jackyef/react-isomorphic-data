
export interface DataClient {
  cache: Record<string, any>;
  pendingPromiseFactories: { () : Promise<any> }[];
  ssr: boolean;
}

export interface DataClientOptions {
  ssr?: boolean;
  initialCache?: Record<string, any>;
}

export interface DataContextAPI {
  client: DataClient;
  addToCache: Function;
}