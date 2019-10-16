---
id: uselazydata
title: useLazyData()
sidebar_label: useLazyData()
---

## `useData(url: string, queryParams: Record<string, any>, fetchOptions: RequestInit = {})`

Example usage:
```javascript
const [fetchData, { data, error, loading }] = useLazyData(
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
);
```

The response from the REST endpoint will be parsed as JSON, and will throw an error if it is not a valid JSON. The `response` will be available in the `data` variable.

The returned value of `useData()` are:

1. `fetchData(): Promise<any>`

    A function that will send the request to the endpoint. You can use this inside an event handler such as `onClick` to trigger the request on demand. The promise will resolve with the data from the endpoint with exactly the same value as `data`.

2. `data <any>`

    The JSON response from the endpoint.

3. `loading <boolean>`

    A `boolean` value that determine whether a request is currently in-flight

4. `error <Error | null>`

    The `Error` object, if any error happened during the network request. `null` if no error happened.

### Supported methods
All HTTP methods are supported. The example show usage of `POST` method, but it could be any HTTP method. But, only `GET` requests are cached.
