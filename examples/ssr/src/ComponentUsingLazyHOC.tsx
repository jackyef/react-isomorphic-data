import React from 'react';
import { withLazyData } from 'react-isomorphic-data';

interface ComponentUsingLazyHOCProps {
  lazyPokemonData: [
    () => Promise<any> | void,
    {
      data: Record<string, any> | null; // data will be null if the response isn't received yet
      loading: boolean;
      error: Error | boolean | null;
    },
  ];
}

class ComponentUsingLazyHOC extends React.Component<ComponentUsingLazyHOCProps> {
  public render() {
    const { lazyPokemonData } = this.props;
    const [load, pokemonData] = lazyPokemonData;

    return (
      <div>
        This is a ComponentUsingLazyHOC. <button onClick={load}> Click me to load pokemonData</button>
        <div>
          <pre>{JSON.stringify(pokemonData, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default withLazyData({
  url: 'https://pokeapi.co/api/v2/pokemon/5/',
  name: 'lazyPokemonData', // the name of the prop the data will be injected to
  fetchOptions: {}, // options that can be accepted by the native `fetch` API
  queryParams: {},
})(ComponentUsingLazyHOC);
