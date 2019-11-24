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
  return (
    <ErrorBoundary errorView={<div>something wrong happened!</div>}>
      <React.Suspense fallback={<div>Route is not ready yet...</div>}>
        <LazyLoadedView />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseRoute;
```
We have `ErrorBoundary` to handle error cases inside our app. An explanation about `ErrorBoundary` can be found in the [React docs here](https://reactjs.org/docs/error-boundaries.html). We also have a `React.Suspense` wrapper that is required if we are using `React.lazy`.

Rendering this component will trigger browser to download the javascript chunk for `LazyLoadedView` component. If we were to use `useData` hook inside `LazyLoadedView`, the request for the data will only be sent *AFTER* the javascript chunk is loaded. This is what usually called a **waterfall**. It causes the overall loading time to be slower.

With `react-isomorphic-data` you can call `useData` inside the `SuspenseRoute` immediately.

```javascript
import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute = () => {
  // We will load the data as we load the javascript chunk to avoid waterfalls
  const { data, loading, error } = useData('http://localhost:3000/some-rest-api/this-is-loaded-in-first-before-the-javascript-chunk');

  return (
    <ErrorBoundary errorView={<div>something wrong happened!</div>}>
      <React.Suspense fallback={<div>Route is not ready yet...</div>}>
        {loading ? 'loading...' : null}
        {error ? 'something wrong happened' : null}
        {!loading && !error ? <LazyLoadedView data={data} /> : null}
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseRoute;
```

This doesn't solve the problem, though; it only moved the problem around. In this case, we are waiting for the data to be received first, and then we start to render `LazyLoadedView`. We will still have a waterfall, because rendering the `LazyLoadedView` waits for the data to be ready first. 

Also, we need to handle the `loading` and `error` states by ourselves. This means we will have 2 pairs loading and error states, one for the data, and another one for the loading the javascript chunk, Wouldn't it be nice if we can just let the existing `Suspense` and `ErrorBoundary` to handle both of them? That is exactly what `react-isomorphic-data` hope to achieve by returning `resource`. 

```javascript
import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute = () => {
  // We will load the data as we load the javascript chunk to avoid waterfalls
  const { resource } = useData('http://localhost:3000/some-rest-api/this-is-loaded-in-parallel-with-the-route-chunk');

  return (
    <ErrorBoundary errorView={<div>something wrong happened!</div>}>
      <React.Suspense fallback={<div>Route is not ready yet...</div>}>
        <LazyLoadedView resource={resource} />
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default SuspenseRoute;
```

The `useData` hook return a `resource` and our wrapper just pass the `resource` to the component that will need the resource; which in this case, is the `LazyLoadedView`. Notice that we just removed all the code needed for handling error and loading states, and just depend on `ErrorBoundary` and `Suspense` to handle those states.

We also start sending requests for both the data and the javascript chunks in parallel in this case, which means we have successfully avoided the waterfall here.

How do we actually use the data in `LazyLoadedView` though? It is very simple. We just call `resource.read()` which will return the data that would be returned from the REST API.

```javascript
import * as React from 'react';

// This is the component that we lazy-loaded using `React.lazy`
const SuspenseMainView = ({ resource }) => {
  // We get the data here by calling `resource.read()`
  // If it's not ready, this component will suspend automatically
  // If there is an error, it will throw an error as well, so the nearest ErrorBoundary can catch it
  const data = resource.read();

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SuspenseMainView;
```

And that's it! Using this pattern will help you achieve better performance for your web app, especially when your app enables [concurrent mode](https://reactjs.org/docs/concurrent-mode-intro.html), which will be available in the future.

>Warning ⚠️
>
>Please note that `Suspense` does not work with server-side rendering yet, so we can not let Suspense handle all our loading states just yet. Though, you still can implement the render-as-you-fetch pattern without Suspense, it will require more code to handle the loading states yourself.
