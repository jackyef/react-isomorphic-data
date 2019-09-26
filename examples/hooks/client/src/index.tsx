import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useLazyData, useData, DataProvider } from 'react-data-async';

import './styles.css';

const App = () => {
  const [fetchData, lazyData] = useLazyData('https://pokeapi.co/api/v2/pokemon/1/', {});
  const eagerData = useData('https://pokeapi.co/api/v2/pokemon/2/', {});

  return (
    <div>
      Example #1
      <div>
        <pre>
          {JSON.stringify(eagerData, null, 2)}
        </pre>
      </div>
      <hr />
      Example #2
      <button onClick={fetchData}>Hit me to fetch data!</button>
      <div>
        <pre>
          {JSON.stringify(lazyData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

ReactDOM.render(
  <DataProvider>
    <App />
  </DataProvider>,
  document.getElementById('root'),
);
