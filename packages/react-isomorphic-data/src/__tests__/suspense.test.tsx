import * as React from 'react';
import { FetchMock } from 'jest-fetch-mock';
import { render, wait } from '@testing-library/react';

import {
  useDataClient,
  withDataClient,
  DataProvider,
  preloadData,
  createDataClient,
} from '../index';

import { DataClient } from '../common/types';

const fetchMock = fetch as FetchMock;

describe('render-as-you-fetch tests', () => {
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

  it('Should fallback to Suspense boundary properly', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));
    const client = createDataClient();
    const url = 'http://localhost:3000/fetch-as-you-render';

    const Component = (props: any) => {
      const data = props.resource.read();

      return <div>{data.message}</div>;
    };
    const Wrapper = () => {
      const client = useDataClient();
      const resource = preloadData(client, url);

      return (
        <React.Suspense fallback={<div>Resource is not ready yet...</div>}>
          <Component resource={resource} />
        </React.Suspense>
      );
    };

    const App = (
      <DataProvider client={client}>
        <Wrapper />
      </DataProvider>
    );

    const { findByText } = render(App);

    const suspenseFallback = await findByText('Resource is not ready yet...');

    expect(suspenseFallback).toBeDefined();

    await wait();

    const actualComponent = await findByText('Hello world!');

    expect(actualComponent).toBeDefined();
  });

  it('Should fallback to Suspense and Error boundaries properly', async () => {
    const fabricatedError = new Error('Fabricated error');
    fetchMock.mockReject(fabricatedError);
    const client = createDataClient();
    const url = 'http://localhost:3000/fetch-as-you-render/2';

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

    const Component = (props: any) => {
      const data = props.resource.read();

      return <div>{data.message}</div>;
    };
    const Wrapper = () => {
      const client = useDataClient();
      const resource = preloadData(client, url);

      return (
        <React.Suspense fallback={<div>Resource is not ready yet...</div>}>
          <ErrorBoundary>
            <Component resource={resource} />
          </ErrorBoundary>
        </React.Suspense>
      );
    };

    const App = (
      <DataProvider client={client}>
        <Wrapper />
      </DataProvider>
    );

    const { findByText } = render(App);

    const suspenseFallback = await findByText('Resource is not ready yet...');

    expect(suspenseFallback).toBeDefined();

    await wait();

    const errorFallback = await findByText('Error happened!');

    expect(errorFallback).toBeDefined();
  });

  it('Should fallback to Suspense boundary properly, with HOC', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));
    const client = createDataClient();
    const url = 'http://localhost:3000/fetch-as-you-render-hoc';

    const Component = (props: any) => {
      const data = props.resource.read();

      return <div>{data.message}</div>;
    };
    const Wrapper = ({ client }: { client: DataClient }) => {
      const resource = preloadData(client, url);

      return (
        <React.Suspense fallback={<div>Resource is not ready yet...</div>}>
          <Component resource={resource} />
        </React.Suspense>
      );
    };

    const WrapperWithClient = withDataClient({ name: 'client' })(Wrapper);

    const App = (
      <DataProvider client={client}>
        <WrapperWithClient />
      </DataProvider>
    );

    const { findByText } = render(App);

    const suspenseFallback = await findByText('Resource is not ready yet...');

    expect(suspenseFallback).toBeDefined();

    await wait();

    const actualComponent = await findByText('Hello world!');

    expect(actualComponent).toBeDefined();
  });
});
