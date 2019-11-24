import * as React from 'react';
import { DataResource } from 'react-isomorphic-data/dist/types/hooks/types';

const SuspenseMainView: React.SFC<{ resource: DataResource }> = ({ resource }) => {
  // We get the data here by calling `resource.read()`
  // If it's not ready, this component will suspend automatically
  const data = resource.read();

  console.log({ data });

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SuspenseMainView;
