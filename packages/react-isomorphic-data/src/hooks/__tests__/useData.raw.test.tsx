import * as React from 'react';
import { FetchMock } from 'jest-fetch-mock';
import { render, wait } from '@testing-library/react';
import { createDataClient, DataProvider } from '../../common';
import useData from '../useData';

const fetchMock = fetch as FetchMock;

describe('useData hook tests', () => {
  const onError = (e: Event) => {
    e.preventDefault();
  };

  beforeEach(() => {
    // to suppress error logs from error boundaries
    // https://github.com/facebook/react/issues/11098#issuecomment-412682721
    window.addEventListener('error', onError);
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    window.removeEventListener('error', onError);
    jest.useRealTimers();
  });

  it('should fetch data correctly', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));

    const client = createDataClient();

    const Comp = () => {
      const { data, loading } = useData(
        'http://localhost/somewhere',
        {},
        {},
        { skip: false, ssr: true, raw: true },
      );

      return loading || !data ? (
        <div>loading...</div>
      ) : (
        <div>{data}</div>
      );
    };
    const App = (
      <DataProvider client={client}>
        <Comp />
      </DataProvider>
    );

    const { findByText } = render(App);

    expect(await findByText('loading...')).toBeDefined();

    await wait();

    expect(await findByText('{\"message\":\"Hello world!\"}')).toBeDefined();
  });

  it('should fetch data correctly; fetchPolicy: "network-only"', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));

    const client = createDataClient();

    const Comp = () => {
      const { data, loading } = useData(
        'http://localhost/somewhere',
        {},
        {},
        { skip: false, ssr: true, fetchPolicy: 'network-only', raw: true },
      );

      return loading || !data ? (
        <div>loading...</div>
      ) : (
        <div>{data}</div>
      );
    };
    const App = (
      <DataProvider client={client}>
        <Comp />
      </DataProvider>
    );

    const { findByText } = render(App);

    expect(await findByText('loading...')).toBeDefined();

    await wait();

    expect(await findByText('{\"message\":\"Hello world!\"}')).toBeDefined();
  });

  it('should throw an error when not wrapped with DataProvider', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));

    class ErrorBoundary extends React.Component {
      state = { error: false, errorObject: null };

      static getDerivedStateFromError(error: Error) {
        return { error: true, errorObject: error };
      }

      render() {
        return !this.state.error ? (
          this.props.children
        ) : (
          <div>Error happened!</div>
        );
      }
    }

    const Comp = () => {
      const { data, loading } = useData('http://localhost/somewhere');

      return loading || !data ? (
        <div>loading...</div>
      ) : (
        <div>{data}</div>
      );
    };
    const App = (
      <ErrorBoundary>
        <Comp />
      </ErrorBoundary>
    );

    const { findByText } = render(App);

    expect(await findByText('Error happened!')).toBeDefined();
  });
});


describe('useData hook with ssrForceFetchDelay', () => {
  const onError = (e: Event) => {
    e.preventDefault();
  };

  beforeEach(() => {
    // to suppress error logs from error boundaries
    // https://github.com/facebook/react/issues/11098#issuecomment-412682721
    window.addEventListener('error', onError);
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    window.removeEventListener('error', onError);
    jest.useRealTimers();
  });

  it('should not fetch again; fetchPolicy: "network-only"', async () => {
    const client = createDataClient({
      initialCache: {
        'http:': {
          localhost: {
            somewhere: {
              __raw: '{"message":"initial message","randomNumber":55}',
            }
          }
        }
      },
      ssrForceFetchDelay: 1000,
    });

    const Comp = () => {
      const { data, loading } = useData(
        'http://localhost/somewhere',
        {},
        {},
        { skip: false, ssr: true, fetchPolicy: 'network-only', raw: true },
      );

      return loading || !data ? (
        <div>loading...</div>
      ) : (
        <div>{data}</div>
      );
    };
    const App = (
      <DataProvider client={client}>
        <Comp />
      </DataProvider>
    );

    const { findByText } = render(App);

    expect(await findByText('{"message":"initial message","randomNumber":55}')).toBeDefined();
  });

})