---
id: create-data-client
title: createDataClient()
sidebar_label: createDataClient()
description: 'Various configurations you can pass to createDataClient()'
---

## `createDataClient`
Params:
* `options: createDataClientOptions`

```ts
interface createDataClientOptions {
  ssr?: boolean;
  ssrForceFetchDelay?: number;
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only';
  test?: boolean;
  initialCache?: Record<string, any>;
  headers?: Record<string, string>;
}
```

Example usage:
```javascript
import { createDataClient } from 'react-isomorphic-data';

const client = createDataClient({
  ssr: false,
});
```

### Configurations
Following is a list of all the fields possible to be configured in the `createDataClientOptions` object

#### `ssr`
* Type: `boolean`
* Default: `false`

Determines whether the `dataClient` instance will run on server-side or not.

#### `ssrForceFetchDelay`
* Type: `number`
* Default: `0`

Determines how many milliseconds the `dataClient` should prevent client-side refetching on hook/HOC using `network-only` fetchPolicy.

#### `fetchPolicy`
* Type: `'cache-first' | 'cache-and-network' | 'network-only'`
* Default: `'cache-first'`

Determines the how the default fetchPolicy to be used. A more detailed explanation can be found in [Caching](./caching.md).

#### `test`
* Type: `boolean`
* Default: `false`

Determines whether the `dataClient` instance will run in test environment.

#### `initialCache`
* Type: `object`
* Default: `{}`

An object to be used as the client's initial cache. Example usage can be seen in [Client-side hydration](../ssr/client-side-hydration.md).

#### `headers`
* Type: `Record<string, string>`
* Default: `false`

Set the default headers that will be included in all other fetch requests. Can be used on server side to forward cookies. Does not work on [prefetching](../ssr/prefetching.md) due to how `<link rel="prefetch">` works.
