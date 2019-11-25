import * as React from 'react';

const SuspenseMainView: React.SFC<{}> = () => {
  // We get the data here by calling `resource.read()`
  // If it's not ready, this component will suspend automatically

  return (
    <>
      <div>
        <pre>{JSON.stringify({}, null, 2)}</pre>
      </div>
    </>
  );
};

export default SuspenseMainView;
