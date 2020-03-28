import React from 'react';
import { useData } from 'react-isomorphic-data';

const Comp = () => {
  const { data } = useData(
    'http://localhost:3000/some-rest-api/1/24-hook',
    {},
    {}, // options that can be accepted by the native `fetch` API
    {
      // additional options
      ssr: false,
      fetchPolicy: 'network-only',
    },
  );

  return (
    <div>
      This is a Comp using hook.
      <div>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
};
export default Comp;
