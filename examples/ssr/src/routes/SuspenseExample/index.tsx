import * as React from 'react';
import { preloadData, useDataClient } from 'react-isomorphic-data';
import { DataResource } from 'react-isomorphic-data/dist/types/common/types';

const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute: React.SFC<{}> = () => {
  const client = useDataClient();
  const [show, setShow] = React.useState(false);
  const [resource, setResource] = React.useState<DataResource>({ read: () => {} });

  const showLazyLoadedComponent = () => {
    setShow(true);
    setResource(preloadData(client, 'http://localhost:3000/some-rest-api/this-is-loaded-in-parallel-with-the-route-chunk'));
  };

  return (
    <>
      <button onClick={showLazyLoadedComponent}>Show a lazy-loaded component</button>
      {show ? (
        <React.Suspense fallback={<div>Route is not ready yet...</div>}>
          <LazyLoadedView resource={resource} />
        </React.Suspense>
      ) : null}
    </>
  );
};

export default SuspenseRoute;
