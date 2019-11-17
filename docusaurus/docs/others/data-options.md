---
id: data-options
title: dataOptions
sidebar_label: dataOptions
---

`dataOptions` is an object that you can pass configurations to, to tweak the behavior of your particular hook or HOC. It is the 4th param you pass to the hook (either `useData` or `useLazyData`), or the `dataOptions` field of the object you pass to the HOC (`withData` or `withLazyData`).

### Passing `dataOptions`
1. To hook
```javascript
const { data, error, loading } = useData(
  'http://localhost:3000/some-rest-api/3', 
  {
    query: 'params',
  },
  {
    method: 'GET',
  },
  
  // This 4th param is the `dataOptions` object
  {
    ssr: true,
    fetchPolicy: 'cache-first',
  }
);
```

2. To HOC
```javascript
const MyComponent = () => {}
const MyComponentWithData = withData({
  url: 'http://localhost:3000/some-rest-api/24',
  name: 'myData',
  queryParams: { query: 'params' },
  fetchOptions: { method: 'GET' },

  // passed in the `dataOptions` field
  dataOptions: { 
    ssr: true,
    fetchPolicy: 'cache-first',
  },
})(MyComponent);
```

### Configurations
Following is a list of all the fields possible to be configured in the `dataOptions` object

#### `ssr`
* Type: `boolean`
* Default: `true`

Determines whether the particular data should be fetched during server side rendering or not. Setting this `true` does not affect lazy data.


#### `fetchPolicy`
* Type: `'cache-first' | 'cache-and-network' | 'network-only'`
* Default: `'cache-first'`

Determines the how the data is handled. A more detailed explanation can be found in [Caching](./caching.md).

#### `prefetch`
* Type: `boolean`
* Default: `false`

Determines whether the particular data should be prefetched. Usually used with lazy data. This has no effect when `ssr` is `true`. A more detailed explanation can be found in [Prefetching](../ssr/prefetching.md). 
