---
id: withdataclient
title: withDataClient()
sidebar_label: withDataClient()
---

## `withDataClient`
Params:
* `options: Object`
  * `name: string`

> To learn more about what `dataOptions` can be passed, go [here](../others/data-options.md).

Example usage:
```javascript
import * as React from 'react';
import { preloadData, withDataClient } from 'react-isomorphic-data';

const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute = ({ dataClient }) => {
  const client = dataClient;

  const handleClick = () => {
    preloadData(client, 'http://localhost:3000/rest-api');
  }


  return <div>Something</div>
};

export default withDataClient({ name: 'dataClient' })(SuspenseRoute);
```

The HOC will inject a `DataClient` instance as a props named `name` (depending on the `name` you passed to the HOC), which is basically exactly the same as what [`useDataClient()`](../hooks/useDataClient.md) is returning.
