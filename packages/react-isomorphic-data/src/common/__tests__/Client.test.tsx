import { createDataClient } from '../Client';

describe('DataClient', () => {
  test('DataClient can be created without any params', async () => {
    const client = createDataClient();

    expect(client.ssr).toBe(false);
  })
  test('DataClient can be created on SSR mode correctly', async () => {
    const client = createDataClient({ ssr: true, headers: { 'x-header': 'custom header' } });

    expect(client.ssr).toBe(true);
    expect(client.headers['x-header']).toBe('custom header');
    expect(client.ssrForceFetchDelay).toBe(0);
  })
  test('DataClient can be created on non-SSR mode without initialCache', async () => {
    const client = createDataClient({ ssr: false });

    expect(client.ssr).toBe(false);
    expect(Object.keys(client.cache).length).toBe(0);
  })
  test('DataClient can be created on non-SSR mode with initialCache', async () => {
    const client = createDataClient({ ssr: false, initialCache: { foo: 'bar' } });

    expect(client.ssr).toBe(false);
    expect(Object.keys(client.cache).length).toBe(1);
    expect(client.cache.foo).toBe('bar');
  })

  test('DataClient can be allow to set force fetch delay', async () => {
    const client = createDataClient({ ssr: false, ssrForceFetchDelay: 200 });

    expect(client.ssrForceFetchDelay).toBe(200);
  })

  test('DataClient subscription model works properly', async () => {
    const client = createDataClient({ ssr: false });

    const callback = jest.fn();
    const callback2 = jest.fn();
    const keyToBeUpdated = 'http://localhost:3000/some-url';

    client.addSubscriber(keyToBeUpdated, callback);
    client.addSubscriber(keyToBeUpdated, callback2);

    expect(callback).not.toHaveBeenCalled();
    expect(callback2).not.toHaveBeenCalled();

    client.notifySubscribers(keyToBeUpdated);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);

    client.removeSubscriber(keyToBeUpdated, callback);

    client.notifySubscribers(keyToBeUpdated);

    expect(callback).toHaveBeenCalledTimes(1); // should not be called anymore
    expect(callback).not.toHaveBeenCalledTimes(2);
    expect(callback2).toHaveBeenCalledTimes(2);
  })
});
