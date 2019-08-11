import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useAsyncData } from 'react-data-async';

interface PropsMapper {
  (resolvedValue: any): any;
}

interface AsyncDataState {
  data: any,
  error: Error | boolean | null,
  loading: boolean,
}

const App = () => {
  const { data, loading, error } = useAsyncData('https://pokeapi.co/api/v2/pokemon/1/', {}, (result: any) => {
    return result
  });

  return (
    <div>
      Hello world
      <div>
        <pre>
          data:
          {JSON.stringify(data, null, 2)}
        </pre>
        <pre>
          loading:
          {JSON.stringify(loading, null, 2)}
        </pre>
        <pre>
          error:
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
