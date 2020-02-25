import * as React from 'react';
import { FetchMock } from 'jest-fetch-mock';

import { getDataFromTree, renderToStringWithData } from '../index';
import { DataProvider, createDataClient, retrieveFromCache } from '../../common';
import { useData, useLazyData } from '../../hooks';
import createPrefetchTags from '../createPrefetchTags';
import { withLazyData, withData } from '../../hoc';

const fetchMock = fetch as FetchMock;

interface TestDataInterface {
  message: string;
};

describe('Server-side rendering utilities test', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('Should getDataFromTree correctly, leaving renderToString to user choice', async () => {
    const url = 'http://localhost:3000/some-rest-api';
    const client = createDataClient({ initialCache: {}, ssr: true });
    const Component = () => {
      const { loading, data } = useData<TestDataInterface>(url);

      return loading || !data ? <div>loading...</div> : <div>{data.message}</div>;
    };

    const App = (
      <DataProvider client={client}>
        <Component />
      </DataProvider>
    );

    await getDataFromTree(App, client);

    expect(retrieveFromCache(client.cache, url)).toStrictEqual({ message: 'Hello world!' });
  });

  it('Should render a HTML markup with fetched data correctly', async () => {
    const client = createDataClient({ initialCache: {}, ssr: true });
    const Component = () => {
      const { loading, data } = useData<TestDataInterface>('http://localhost:3000/some-rest-api');

      return loading || !data ? <div>loading...</div> : <div>{data.message}</div>;
    };

    const App = (
      <DataProvider client={client}>
        <Component />
      </DataProvider>
    );

    const markup = await renderToStringWithData(App, client);

    expect(markup).toContain('Hello world!');
  });

  it('Should render a HTML markup with nested data fetching correctly', async () => {
    const client = createDataClient({ initialCache: {}, ssr: true });
    const ComponentB = () => {
      const { loading, data } = useData<TestDataInterface>(
        'http://localhost:3000/some-rest-api/2',
      );

      return loading || !data ? (
        <div>loading...</div>
      ) : (
        <div>{`ComponentB: ${data.message}`}</div>
      );
    };
    const Component = () => {
      const { loading } = useData('http://localhost:3000/some-rest-api');

      return loading ? <div>loading...</div> : <ComponentB />;
    };

    const App = (
      <DataProvider client={client}>
        <Component />
      </DataProvider>
    );

    const markup = await renderToStringWithData(App, client);

    expect(markup).toContain('ComponentB: Hello world!');
  });

  it('Should render a HTML markup with nested data fetching correctly (HOC)', async () => {
    const client = createDataClient({ initialCache: {}, ssr: true });
    const ComponentB = withData({
      url: 'http://localhost:3000/some-rest-api/2',
      name: 'isoData',
    })((props: any) => {
      const { loading, data } = props.isoData;

      return loading ? (
        <div>loading...</div>
      ) : (
        <div>{`ComponentB: ${data.message}`}</div>
      );
    });

    const Component = withData({
      url: 'http://localhost:3000/some-rest-api',
      name: 'isoData',
    })((props: any) => {
      const { loading } = props.isoData;

      return loading ? <div>loading...</div> : <ComponentB />;
    });

    const App = (
      <DataProvider client={client}>
        <Component />
      </DataProvider>
    );

    const markup = await renderToStringWithData(App, client);

    expect(markup).toContain('ComponentB: Hello world!');
  });

  it('Should create prefetch tags correctly', async () => {
    const url = 'http://localhost:3000/some-rest-api';
    const client = createDataClient({ initialCache: {}, ssr: true });
    const Component = () => {
      const [, { data, loading }] = useLazyData(
        url,
        {},
        {},
        {
          prefetch: true,
        },
      );

      return !data || loading ? <div>loading...</div> : <div>loaded!</div>;
    };

    const App = (
      <DataProvider client={client}>
        <Component />
      </DataProvider>
    );

    const markup = await renderToStringWithData(App, client);

    expect(markup).toContain('loading...');

    expect(createPrefetchTags(client)).toBe(
      `<link rel="prefetch" href="${url}" />`,
    );
  });

  it('Should create prefetch tags correctly (HOC)', async () => {
    const url = 'http://localhost:3000/some-rest-api';
    const client = createDataClient({ initialCache: {}, ssr: true });
    const Component = (props: any) => {
      const lazyData: ReturnType<typeof useLazyData> = props.lazyData;
      const [, { data, loading }] = lazyData;

      return !data || loading ? <div>loading...</div> : <div>loaded!</div>;
    };
    const WrappedComponent = withLazyData({
      url,
      queryParams: {},
      fetchOptions: {},
      dataOptions: {
        prefetch: true,
      },
      name: 'lazyData',
    })(Component);

    const App = (
      <DataProvider client={client}>
        <WrappedComponent />
      </DataProvider>
    );

    const markup = await renderToStringWithData(App, client);

    expect(markup).toContain('loading...');

    expect(createPrefetchTags(client)).toBe(
      `<link rel="prefetch" href="${url}" />`,
    );
  });
});
