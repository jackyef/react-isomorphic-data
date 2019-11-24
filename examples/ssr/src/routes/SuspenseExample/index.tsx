import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const LazyLoadedView = React.lazy(() => import(/* webpackChunkName: "lazy-loaded-route" */ './views/main'));

const SuspenseRoute: React.SFC<{}> = () => {
  // We will load the data as we load the javascript chunk to avoid waterfalls
  const { loading, resource } = useData(
    'http://localhost:3000/some-rest-api/this-is-loaded-in-parallel-with-the-route-chunk',
    {},
    {},
    {
      ssr: false,
      fetchPolicy: 'network-only',
    },
  );

  console.log({ loading });

  return (
    <React.Suspense fallback={<div>Route is not ready yet...</div>}>
      <LazyLoadedView resource={resource} />
    </React.Suspense>
  );
};

export default SuspenseRoute;
