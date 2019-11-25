import * as React from 'react';
import { DataResource } from 'react-isomorphic-data/dist/types/common/types';

const SomeData: React.SFC<{ resource: DataResource }> = ({ resource }) => {
  const data = resource ? resource.read() : null;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default SomeData;
