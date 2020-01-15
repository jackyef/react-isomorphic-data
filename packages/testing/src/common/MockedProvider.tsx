import * as React from 'react';
import {
  DataContext,
  addToCache as normalisedAddToCache,
  retrieveFromCache as _retrieveFromCache,
  DataContextAPI,
  createDataClient,
} from 'react-isomorphic-data';

import qsify from '../utils/querystringify/querystringify.js';

interface MockRequest {
  url: string;
  queryParams: Record<string, any>;
}

interface DataMock {
  request: MockRequest;
  response: any;
}

interface MockedProviderProps {
  children: JSX.Element[] | JSX.Element;
  mocks: DataMock[];
}

let mockedCache: Record<string, any>;

const createMockedClient = (mocks: DataMock[]) => {
  mockedCache = {};

  const client = createDataClient({
    initialCache: {},
    ssr: false,
    test: true,
  });

  mocks.forEach(mock => {
    const { request, response } = mock;

    const url = request.url || '';
    const queryParams = request.queryParams || {};

    normalisedAddToCache(mockedCache, `${url}${qsify(queryParams, '?')}`, response);
  });

  return client;
};

const MockedProvider: React.FC<MockedProviderProps> = ({ mocks, children }) => {
  const clientRef = React.useRef(createMockedClient(mocks));
  const client = clientRef.current;

  const [, setNumber] = React.useState<number>(0);
  const { toBePrefetched } = client;

  const addToBePrefetched = React.useCallback(
    (url: string) => {
      toBePrefetched[url] = true;
    },
    [toBePrefetched],
  );

  const addToCache = React.useCallback(
    (key: string, value: any) => {
      normalisedAddToCache(client.cache, key, value);

      if (!client.ssr) {
        // force an update
        setNumber((prev) => prev + 1);
      }
    },
    [client.cache, client.ssr],
  );

  const retrieveFromCache = (url: string) => {
    return _retrieveFromCache(client.cache, url);
  }

  const mockedFetch = React.useCallback<DataContextAPI["fetcher"]>((url) => {
    if (typeof url !== 'string') {
      throw new Error('@react-isomorphic-data/testing only supports fetching string url, not `Request` object');
    }

    return new Promise((resolve, reject) => {
      const fromCache = _retrieveFromCache(mockedCache, url);

      if (fromCache) {
        const mockResponse = {
          json: function() {
            return new Promise(resolve => resolve(fromCache));
          },
          text: function() {
            return new Promise(resolve => resolve(JSON.stringify(fromCache)));
          },
        };

        resolve(mockResponse);
      } else {
        reject(new Error(`[isomorphic-data mock] Failed to fetch data. Did you forget to pass mock data for url: "${url}"?`));
      }
    });
  }, []);

  const injectedValues: DataContextAPI = {
    client,
    addToCache,
    addToBePrefetched,
    retrieveFromCache,
    fetcher: mockedFetch,
  };

  return (
    <DataContext.Provider value={injectedValues}>
      {children}
    </DataContext.Provider>
  );
};

export default MockedProvider;
