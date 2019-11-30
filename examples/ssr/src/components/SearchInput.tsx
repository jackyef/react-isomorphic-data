import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const SearchInput = () => {
  const [searchText, setSearchText] = React.useState('');
  const { data, error, loading }: {
    data: any,
    error: Error | null,
    loading: boolean,
  } = useData('http://localhost:3000/some-rest-api', {
    q: searchText,
  });

  return (
    <div>
      <input type="text" onChange={e => setSearchText(e.target.value)} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {loading ? 'loading...' : null}
      {error ? error.message : null}
    </div>
  )
}

export default SearchInput;
