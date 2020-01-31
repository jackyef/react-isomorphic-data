---
id: withdata
title: withData()
sidebar_label: withData()
description: 'Explanation about withData() HOC in react-isomorphic-data'
---

## `withData`
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
  const { data, loading, error, refetch } = this.props.pokemonData;

  return (
    loading 
      ? 'loading...' 
      : <div>The data is: {JSON.stringify(data)}</div>
  );
};

export default withData({
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
    ssr: true,
  },
})(MyComponent);
```

The response from the REST endpoint will be parsed as JSON, and will throw an error if it is not a valid JSON. The `response` will be available in the `data` variable.

The HOC will inject an object as a props named `name` (depending on the `name` you passed to the HOC). The object contains the following keys:

1. `data <any>`

    The JSON response from the endpoint

2. `loading <boolean>`

    A `boolean` value that determine whether a request is currently in-flight

3. `error <Error | null>`

    The `Error` object, if any error happened during the network request. `null` if no error happened.

4. `refetch: () => Promise<any>`

    A function that will trigger refetching data from network. Fetching data from network this way will always bypass the cache, no matter what the [`fetchPolicy`](../others/caching.md#caching-strategies) is set to.

Which are basically exactly the same as what [`useData()`](../hooks/useData.md) is returning.

### Supported methods
Same as [`useData()`](../hooks/useData.md), only `GET` requests are supported. Supporting other methods is not in the plan because it can be dangerous to re-request a non-idempotent request on component state update.
