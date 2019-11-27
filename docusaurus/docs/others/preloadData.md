---
id: preloaddata
title: preloadData()
sidebar_label: preloadData()
---

## `preloadData`
Params:
* `client: DataClient`
* `url: string`
* `queryParams: Record<string, any> = {}`
* `fetchOptions: RequestInit = {}`
* `dataOptions: DataHookOptions = {}`

> To learn more about what `dataOptions` can be passed, go [here](./data-options.md).

>Note: `preloadData()` only supports `cache-first` and `network-only` `fetchPolicy`.

Example usage:
```javascript
import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute = () => {
  const client = useDataClient();
  const [show, setShow] = React.useState(false);
  const [resource, setResource] = React.useState();
  const showLazyLoadedComponent = () => {
    setShow(true);

    // we store the `resource` in state
    setResource(preloadData(client, 'http://localhost:3000/some-rest-api/this-is-loaded-in-parallel-with-the-route-chunk'));
  };

  return (
    <>
      <button onClick={showLazyLoadedComponent}>Show a lazy-loaded component</button>
      {show ? (
        <ErrorBoundary errorView={<div>something wrong happened!</div>}>
          <React.Suspense fallback={<div>Route is not ready yet...</div>}>
            {/* and pass it down as props */}
            <LazyLoadedView resource={resource} />
          </React.Suspense>
        </ErrorBoundary>
      ) : null}
    </>
  );
};

export default SuspenseRoute;

// ./views/main.js
import * as React from 'react';

const SuspenseMainView = ({ resource }) => {
  // We get the data here by calling `resource.read()`
  // If it's not ready, this component will suspend automatically
  const data = resource ? resource.read() : null;

  return (
    <>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </>
  );
};

export default SuspenseMainView;
```

The returned value of `preloadData()` is a `resource` object. We can call `resource.read()` to try get the data. If the data is not ready yet, the component will suspend by throwing a promise. This will be caught by the nearest `<Suspense>` wrapper, and React will resume rendering this component once the promise resolves. If there is an error while fetching the data, the nearest `<ErrorBoundary>` will handle it instead. Because of this, you need both of these wrappers when using `preloadData()`

>Warning ⚠️
>
>Please note that `Suspense` does not work with server-side rendering yet, so we can not let Suspense handle all our loading states just yet. Though, you still can implement the render-as-you-fetch pattern without Suspense, it will require more code to handle the loading states yourself. It also doesn't allow React to resume rendering some part of the component tree, because that is only achieveable by using Suspense.
