import React from 'react';
import { useData, useLazyData } from 'react-isomorphic-data';

import ComponentUsingHOC from './ComponentUsingHOC';
import ComponentUsingLazyHOC from './ComponentUsingLazyHOC';
import logo from './react.svg';

import './Home.css';

const ChildComponent = () => {
  const eagerData = useData('https://pokeapi.co/api/v2/pokemon/3/', {});

  return (
    <div>
      This is ChildComponent.
      <div>
        <pre>{JSON.stringify(eagerData, null, 2)}</pre>
      </div>
    </div>
  );
};

const Home = () => {
  const [fetchData, lazyData] = useLazyData('https://pokeapi.co/api/v2/pokemon/1/', {});
  const eagerData = useData('https://pokeapi.co/api/v2/pokemon/2/', {}, {
    headers: {
      'x-custom-header': 'will only be sent for pokemon/2 request',
    },
  });

  return (
    <div className="Home">
      <div className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <h2>
          Welcome to <code>react-isomorphic-data</code>
        </h2>
      </div>
      <div className="Example-container">
        Example #1
        <div>
          <pre>{JSON.stringify(eagerData, null, 2)}</pre>
        </div>
        <hr />
        Example #2 <button onClick={fetchData}>Hit me to fetch data!</button>
        <div>
          <pre>{JSON.stringify(lazyData, null, 2)}</pre>
        </div>
        {eagerData.loading ? null : (
          <>
            <ChildComponent />
            <ComponentUsingHOC />
            <ComponentUsingLazyHOC />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
