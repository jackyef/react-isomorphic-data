---
id: usedata
title: useData()
sidebar_label: useData()
---

## `useData`
Params
* `url: string`
* `queryParams: Record<string, any>`
* `fetchOptions: RequestInit = {}`
* `dataOptions: DataHookOptions`

> To learn more about what `dataOptions` can be passed, go [here](../others/data-options.md).

Example usage:
```javascript
const { data, error, loading } = useData(
  // the url string of the endpoint we will send request to
  'https://pokeapi.co/api/v2/pokemon/3/', 
  // Object of query params, will be appended to your url
  {
    someQueryParam: 'value',
  }, 
  // Any options that you normally pass to `fetch()`
  {
    method: 'GET',
    headers: {
      'x-custom-header': 'myheadervalue',
    },
  },
  // dataOptions object. Used to configure some behaviors.
  {
    ssr: true,
  },
);
```

The response from the REST endpoint will be parsed as JSON, and will throw an error if it is not a valid JSON. The `response` will be available in the `data` variable.

The returned value of `useData()` are:

1. `data: any`

    The JSON response from the endpoint

2. `loading: boolean`

    A `boolean` value that determine whether a request is currently in-flight

3. `error: Error | null`

    The `Error` object, if any error happened during the network request. `null` if no error happened.

### Supported methods
Only `GET` requests are supported for `useData()`. Supporting other methods is not in the plan because it can be dangerous to re-request a non-idempotent request on component state update.
