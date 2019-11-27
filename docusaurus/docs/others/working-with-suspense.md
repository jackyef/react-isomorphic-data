---
id: suspense
title: Working with React Suspense (Experimental)
sidebar_label: Working with React Suspense
---

`react-isomoprhic-data` provides an easy way for you to implement the [render-as-you-fetch pattern with React Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense) throughout your app with the `resource` object returned by the hooks or HOCs you use.

This allow data to be loaded earlier without waiting a component (which might also be lazily loaded) to render first.

## How to implement it
Let's say we are codesplitting part of our app like such:

```javascript
import * as React from 'react';

const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute = () => {
  const client = useDataClient();
  const [show, setShow] = React.useState(false);

  return (
    <>
      <button onClick={showLazyLoadedComponent}>Show a lazy-loaded component</button>
      {show ? (
        <ErrorBoundary errorView={<div>something wrong happened!</div>}>
          <React.Suspense fallback={<div>Route is not ready yet...</div>}>
            <LazyLoadedView />
          </React.Suspense>
        </ErrorBoundary>
      ) : null}
    </>
  );
};

export default SuspenseRoute;
```
We have `ErrorBoundary` to handle error cases inside our app. An explanation about `ErrorBoundary` can be found in the [React docs here](https://reactjs.org/docs/error-boundaries.html). We also have a `React.Suspense` wrapper that is required if we are using `React.lazy`.

By clicking the button, we will render the `LazyLoadedView` component. This will trigger browser to download the javascript chunk for `LazyLoadedView` component. If we were to use `useData` hook inside `LazyLoadedView`, the request for the data will only be sent *AFTER* the javascript chunk is loaded. This is what usually called a **waterfall**. It causes the overall loading time to be slower.

Following [the advice](https://reactjs.org/docs/concurrent-mode-suspense.html#start-fetching-early) in React docs, we can trigger data fetching in event handler instead of during render. In `react-isomorphic-data` you can achieve this by calling [`preloadData()`](./preloadData.md); the function will return a `resource` from which the component can read.

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
```

`LazyLoadedView` can call `resource.read()` to get the data. If the data is not ready yet, the component will suspend by throwing a promise. This will be caught by the `<Suspense>` wrapper, and React will resume rendering this component once the promise resolves. If there is an error while fetching the data, the `<ErrorBoundary>` will handle it instead. This is why to implement this pattern, you need both of these wrappers.

```javascript
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

And that's it! Using this pattern will help you achieve better performance for your web app, especially when your app enables [concurrent mode](https://reactjs.org/docs/concurrent-mode-intro.html), which will be available in the future.

>Warning ⚠️
>
>Please note that `Suspense` does not work with server-side rendering yet, so we can not let Suspense handle all our loading states just yet. Though, you still can implement the render-as-you-fetch pattern without Suspense, it will require more code to handle the loading states yourself. It also doesn't allow React to resume rendering some part of the component tree, because that is only achieveable by using Suspense.
