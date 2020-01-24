import React from 'react';
import { useData, useLazyData } from 'react-isomorphic-data';
import { DataFromAPI } from './api-types';

import ComponentUsingHOC from './ComponentUsingHOC';
import ComponentUsingLazyHOC from './ComponentUsingLazyHOC';
import SearchInput from './components/SearchInput';
import logo from './react.svg';

import './Home.css';
import Comp from './ComponentUsingHook';

const ChildComponent = ({ id, ssr }: { id: number; ssr: boolean }) => {
  const eagerData = useData<DataFromAPI>(`http://localhost:3000/some-rest-api/${id}`, {}, undefined, {
    ssr,
  });

  return (
    <div>
      This is ChildComponent with <code>{`id: ${id}, ssr: ${ssr}`}</code>
      <div>
        <pre>{JSON.stringify(eagerData, null, 2)}</pre>
      </div>
    </div>
  );
};

const Home = () => {
  const [count, setCount] = React.useState(1);

  const eagerData = useData(
    'http://localhost:3000/some-rest-api/1',
    {
      foo: 'bar',
      symbols: '!@#$%^&*()////\\\\\\+_+_+_+-==~`'
    },
    {
      headers: {
        'x-custom-header': 'will only be sent for some-rest-api/1 request',
      },
    },
    {
      ssr: true, // defaults to true. You can set to false if you don't want this to be fetched during SSR
      fetchPolicy: 'cache-first',
    },
  );

  const [fetchData, lazyData] = useLazyData(
    'http://localhost:3000/some-rest-api/2',
    {},
    {},
    {
      fetchPolicy: 'network-only',
    },
  );

  // response will be returned by the hook
  const [postData, postDataResponse] = useLazyData(
    'http://localhost:3000/some-rest-api/3',
    {},
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ data: 'some data posted from client', foo: 'bar baz', count }),
    },
  );

  return (
    <div className="Home">
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>
          Welcome to <code>react-isomorphic-data</code>
        </h2>
      </div>
      <SearchInput />
      <div className="Example-container">
        Example #1
        <button onClick={() => eagerData.refetch()}>Click me to refetch</button>
        <div>
          <pre>{JSON.stringify(eagerData, null, 2)}</pre>
        </div>
        <hr />
        Example #2 <code>useLazyData()</code> <button onClick={fetchData}>Hit me to fetch data!</button>
        <div>
          <pre>{JSON.stringify(lazyData, null, 2)}</pre>
        </div>
        Example #3 <code>useLazyData()</code> with POST method{' '}
        <button
          onClick={() => {
            const promise = postData();
            setCount(count + 1);
            
            if (promise && promise.then) {
              // you can get the data from the fetcher function as well, if you need to do something imperatively
              // promise.then((data) => console.log({ data }));
            }
          }}
        >
          Hit me to post data!
        </button>
        <div>
          <pre>{JSON.stringify(postDataResponse, null, 2)}</pre>
        </div>
        {eagerData.loading ? null : (
          <>
            <ChildComponent id={123} ssr={true} />
            <Comp />
            <ComponentUsingHOC />
            <ComponentUsingLazyHOC />
          </>
        )}
        <ChildComponent id={99} ssr={false} />
      </div>
    </div>
  );
};

export default Home;
