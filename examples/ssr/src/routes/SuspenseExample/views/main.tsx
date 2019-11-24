import * as React from 'react';
import { DataResource } from 'react-isomorphic-data/dist/types/hooks/types';
import SuspendedWithHOC from '../components/SuspendedWithHOC';

const SuspenseMainView: React.SFC<{ resource: DataResource }> = ({ resource }) => {
  // We get the data here by calling `resource.read()`
  // If it's not ready, this component will suspend automatically
  const data = resource.read();

  return (
    <>
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <SuspendedWithHOC />
    </>
  );
};

export default SuspenseMainView;
