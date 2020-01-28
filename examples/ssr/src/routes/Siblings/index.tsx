import * as React from 'react';

const LazyLoadedView = React.lazy(() =>
  import(/* webpackChunkName: "siblings-route" */ './views/main'),
);

const SiblingsRoute: React.SFC<{}> = () => {
  return (
    <>
      <React.Suspense fallback={<div>Route is not ready yet...</div>}>
        <LazyLoadedView />
      </React.Suspense>
    </>
  );
};

export default SiblingsRoute;
