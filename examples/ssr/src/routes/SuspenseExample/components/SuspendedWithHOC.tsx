import * as React from 'react';
import { withData } from 'react-isomorphic-data';
import { DataState } from 'react-isomorphic-data/dist/types/hooks/types';
import SomeData from './SomeData';

const SuspendedWithHOC: React.SFC<{ someData: DataState }> = ({ someData }) => {
  const { resource } = someData;

  return (
    <React.Suspense fallback={<div><code>SuspendedWithHOC</code> is not ready yet...</div>}>
      <SomeData resource={resource} />
    </React.Suspense>
  )
}

export default withData({
  url: 'http://localhost:3000/some-rest-api/suspense-with-hoc',
  name: 'someData', // the name of the prop the data will be injected to
  queryParams: {},
  fetchOptions: {}, // options that can be accepted by the native `fetch` API
  dataOptions: { // additional options
    ssr: false,
    fetchPolicy: 'cache-and-network',
  },
})(SuspendedWithHOC);
