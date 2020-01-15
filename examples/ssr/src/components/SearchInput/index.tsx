import * as React from 'react';
import { useData } from 'react-isomorphic-data';

import { DataFromAPI } from '../../api-types';

const SearchInput = () => {
  const [searchText, setSearchText] = React.useState('');
  const {
    data,
    error,
    loading,
  } = useData<DataFromAPI>('http://localhost:3000/some-rest-api', {
    q: searchText,
  });

  return (
    <div data-testid="container">
      <input type="text" data-testid="search-input" onChange={(e) => setSearchText(e.target.value)} />
      {data ? <pre data-testid="data">{JSON.stringify(data, null, 2)}</pre> : null}
      {loading ? 'loading...' : null}
      {error ? <div data-testid="error">{error.message}</div> : null}
    </div>
  );
};

export default SearchInput;
