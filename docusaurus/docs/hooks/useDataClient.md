---
id: usedataclient
title: useDataClient()
sidebar_label: useDataClient()
---

## `useDataClient`

Example usage:
```javascript
import { preloadData, useDataClient } from 'react-isomorphic-data';

const Component = () => {
  const client = useDataClient();

  const handleClick = () => {
    preloadData(client, 'http://localhost:3000/rest-api');
  }

  return <div>Something</div>
}
```

The returned value of `useDataClient()` are:

1. `client: DataClient`

    A `DataClient` instance, similar to what is created via `createDataClient()`. Can be passed to `preloadData` to implement [render-as-you-fetch pattern](../others/working-with-suspense.md)
