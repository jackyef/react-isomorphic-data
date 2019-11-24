---
id: uselazydata
title: useLazyData()
sidebar_label: useLazyData()
---

## `useLazyData`
Params
* `url: string`
* `queryParams: Record<string, any>`
* `fetchOptions: RequestInit = {}`
* `dataOptions: DataHookOptions`

> To learn more about what `dataOptions` can be passed, go [here](../others/data-options.md).

Example usage:
```javascript
const [fetchData, { data, error, loading, refetch }] = useLazyData(
  // the url string of the endpoint we will send request to
  'https://pokeapi.co/api/v2/pokemon/3/', 
  // Object of query params, which should be empty in a POST request
  {}, 
  // Any options that you normally pass to `fetch()`
  {
    method: 'POST',
    headers: {
      'x-custom-header': 'myheadervalue',
    },
  },
  // dataOptions object. Used to configure some behaviors.
  {
    ssr: false,
  },
);
```

The response from the REST endpoint will be parsed as JSON, and will throw an error if it is not a valid JSON. The `response` will be available in the `data` variable.

The returned value of `useData()` are:

1. `fetchData(): Promise<any>`

    A function that will send the request to the endpoint. You can use this inside an event handler such as `onClick` to trigger the request on demand. The promise will resolve with the data from the endpoint with exactly the same value as `data`. Fetching data this way will still respect the [`fetchPolicy`](../others/caching.md#caching-strategies).

2. `data <any>`

    The JSON response from the endpoint.

3. `loading <boolean>`

    A `boolean` value that determine whether a request is currently in-flight

4. `error <Error | null>`

    The `Error` object, if any error happened during the network request. `null` if no error happened.

5. `refetch: () => Promise<any>`

    A function that will trigger refetching data from network. Fetching data from network this way will always bypass the cache, no matter what the [`fetchPolicy`](../others/caching.md#caching-strategies) is set to.

6. `resource: DataResource`

    An object to be used when working with `Suspense`. Read more [here](../others/working-with-suspense.md)

### Supported methods
All HTTP methods are supported. The example show usage of `POST` method, but it could be any HTTP method. But, only `GET` requests are cached.
