---
id: withlazydata
title: withLazyData()
sidebar_label: withLazyData()
---

## `withLazyData`
Params:
* `options: HocOptions`
  * `url: string`
  * `name: string`
  * `queryParams: Record<string, any>`
  * `fetchOptions: RequestInit = {}`
  * `dataOptions: DataHookOptions`


> To learn more about what `dataOptions` can be passed, go [here](../others/data-options.md).

Example usage:
```javascript
const MyComponent = () => {
  const [fetchData, { data, loading, error, refetch }] = this.props.pokemonData;

  return (
    !data
      ? <button onClick={fetchData}>Click me to load data</button>
      : <div>The data is: {JSON.stringify(data)}</div>
  );
};

export default withLazyData({
  // the url string of the endpoint we will send request to
  url: 'https://pokeapi.co/api/v2/pokemon/4/',
  // the name of the prop the data will be injected to
  name: 'pokemonData', 
  // Object of query params
  queryParams: {},
  // Any options that you normally pass to `fetch()`
  fetchOptions: {
    method: 'GET',
  }, 
  // dataOptions object. Used to configure some behaviors.
  dataOptions: {
    ssr: false,
  },
})(MyComponent);
```

The response from the REST endpoint will be parsed as JSON, and will throw an error if it is not a valid JSON. The `response` will be available in the `data` variable.

The HOC will inject a 2-element array as a props named `name` (depending on the `name` you passed to the HOC). The first element of the array will be the `fetchData()` function, and the second element will be an object with similar keys to what is injected by [`withData()`](./withData.md):

1. `fetchData(): Promise<any>`

    A function that will send the request to the endpoint. You can use this inside an event handler such as `onClick` to trigger the request on demand. The promise will resolve with the data from the endpoint with exactly the same value as `data`. Fetching data this way will respect the [`fetchPolicy`](../others/caching.md#caching-strategies).

2. `data <any>`

    The JSON response from the endpoint.

3. `loading <boolean>`

    A `boolean` value that determine whether a request is currently in-flight

4. `error <Error | null>`

    The `Error` object, if any error happened during the network request. `null` if no error happened.

5. `refetch: () => Promise<any>`

    A function that will trigger refetching data from network. Fetching data from network this way will always bypass the cache, no matter what the [`fetchPolicy`](../others/caching.md#caching-strategies) is set to.

Which are basically exactly the same as what [`useLazyData()`](../hooks/useLazyData.md) is returning.

### Supported methods
Same as [`useLazyData()`](../hooks/useLazyData.md), all HTTP methods are supported. But, only `GET` requests are cached.