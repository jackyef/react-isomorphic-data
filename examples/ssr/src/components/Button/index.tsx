import * as React from 'react';
import { useLazyData } from 'react-isomorphic-data';

import { DataFromAPI } from '../../api-types';

const Button = () => {
  const [triggerLoad, { data, error, loading }] = useLazyData<DataFromAPI>(
    'http://localhost:3000/some-rest-api',
  );

  return (
    <div data-testid="container">
      <button data-testid="button" onClick={() => triggerLoad()}>
        Click me
      </button>
      {data ? (
        <pre data-testid="data">{JSON.stringify(data, null, 2)}</pre>
      ) : null}
      {loading ? 'loading...' : null}
      {error ? <div data-testid="error">{error.message}</div> : null}
    </div>
  );
};

export default Button;
