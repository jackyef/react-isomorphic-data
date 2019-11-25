import * as React from 'react';
const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute: React.SFC<{}> = () => {
  // We will load the data as we load the javascript chunk to avoid waterfalls

  return (
    <React.Suspense fallback={<div>Route is not ready yet...</div>}>
      <LazyLoadedView />
    </React.Suspense>
  );
};

export default SuspenseRoute;
