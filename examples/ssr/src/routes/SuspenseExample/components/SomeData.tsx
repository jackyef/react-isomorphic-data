import * as React from 'react';
import { DataResource } from 'react-isomorphic-data/dist/types/hooks/types';

const SomeData: React.SFC<{ resource: DataResource }> = ({ resource }) => {
  const data = resource.read();

  return <div>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
}

export default SomeData;
