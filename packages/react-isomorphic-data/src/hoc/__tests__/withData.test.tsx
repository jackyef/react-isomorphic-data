import * as React from 'react';
import { FetchMock } from 'jest-fetch-mock';
import { render } from '@testing-library/react';
import { createDataClient, DataProvider } from '../../common';
import withData from '../withData';

const fetchMock = fetch as FetchMock;

describe('withData HOC with ssrForceFetchDelay', () => {
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

    const _Comp: React.FC<{ isoData: any }> = ({ isoData }) => {
      const { data, loading } = isoData;

      return loading || !data ? (
        <div>loading...</div>
      ) : (
        <div>{data.message}</div>
      );
    };

    const Comp = withData({
      url: 'http://localhost/somewhere',
      name: 'isoData',
      dataOptions: { skip: false, ssr: true, fetchPolicy: 'network-only' }
    })(_Comp);
    const App = (
      <DataProvider client={client}>
        <Comp />
      </DataProvider>
    );

    const { findByText } = render(App);

    expect(await findByText('initial message')).toBeDefined();
  });

})