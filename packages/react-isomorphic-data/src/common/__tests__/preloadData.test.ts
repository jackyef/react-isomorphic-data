import { FetchMock } from 'jest-fetch-mock';
import preloadData from '../preloadData';
import { createDataClient } from '../Client';

const fetchMock = fetch as FetchMock;

describe('preloadData tests', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('Should throw a promise when data is not ready yet', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));
    const client = createDataClient({ ssr: false });
    const url = 'http://localhost:3000/some-rest-api';

    const resource = preloadData(client, url);

    expect(resource.read).toThrow();
    
    try {
      resource.read();
    } catch (promise) {
      await promise;
      
      expect(resource.read()).toStrictEqual({ message: 'Hello world!' });
    }
  });

  it('Should throw an error the fetch is rejected', async () => {
    const fabricatedError = new Error('Fabricated error');
    const client = createDataClient({ ssr: false });
    const url = 'http://localhost:3000/some-rest-api/2';

    const resource = preloadData(client, url);

    expect(resource.read).toThrow();
    
    fetchMock.mockReject(fabricatedError);
    
    try {
      resource.read();
    } catch (promise) {
      await promise;
     
      expect(resource.read).toThrowError();
    }
  });

  it('Should use data from cache if available', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));
    const client = createDataClient({ ssr: false });
    const url = 'http://localhost:3000/some-rest-api/3';

    const resource = preloadData(client, url);

    expect(resource.read).toThrow();
     
    try {
      resource.read();
    } catch (promise) {
      await promise;
     
      expect(resource.read()).toStrictEqual({ message: 'Hello world!' });

      const resource2 = preloadData(client, url);

      expect(resource2.read()).toStrictEqual(resource.read());
    }
  });

  it('Should not store data to cache when fetchPolicy is network-only', async () => {
    fetchMock.mockResponse(JSON.stringify({ message: 'Hello world!' }));
    const fabricatedError = new Error('Fabricated error');
    const client = createDataClient({ ssr: false });
    const url = 'http://localhost:3000/some-rest-api/4';

    const resource = preloadData(client, url, {}, {}, {
      fetchPolicy: 'network-only',
    });

    expect(resource.read).toThrow();
    
    fetchMock.mockReject(fabricatedError);
    
    try {
      resource.read();
    } catch (promise) {
      await promise;
      
      expect(resource.read()).toStrictEqual({ message: 'Hello world!' });
      
      const resource2 = preloadData(client, url);
      
      expect(resource2.read).toThrowError();
    }
  });
});
