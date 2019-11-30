import * as React from 'react';
import { useData } from 'react-isomorphic-data';

const SearchInput = () => {
  const [searchText, setSearchText] = React.useState('');
  // const { data, error, loading } = useData('https://api.npms.io/v2/search/suggestions', {
  //   q: searchText,
  // });
  const { data, error, loading } = useData('http://localhost:3000/some-rest-api', {
    q: searchText,
  });

  console.log({ data, error, loading });

  return (
    <div>
      <input type="text" onChange={e => setSearchText(e.target.value)} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {loading ? 'loading...' : null}
      {/* {error ? error : null} */}
    </div>
  )
}

export default SearchInput;
