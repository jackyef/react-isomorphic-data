import React from 'react';
import { withData } from 'react-isomorphic-data';

interface ComponentUsingHOCProps {
  pokemonData: {
    data: Record<string, any> | null; // data will be null if the response isn't received yet
    loading: boolean;
    error: Error | boolean | null;
  };
}

class ComponentUsingHOC extends React.Component<ComponentUsingHOCProps> {
  static whyDidYouRender = true;

  private prev: any;

  public render() {
    const { pokemonData } = this.props;

    // console.log('render', pokemonData);

    // console.log('same?', this.prev === pokemonData);
    this.prev = pokemonData;

    return (
      <div>
        This is a ComponentUsingHOC.
        <div>
          <pre>{JSON.stringify(pokemonData, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

const WithHOC = withData({
  url: 'http://localhost:3000/some-rest-api/24',
  name: 'pokemonData', // the name of the prop the data will be injected to
  queryParams: {},
  fetchOptions: {}, // options that can be accepted by the native `fetch` API
  dataOptions: {
    // additional options
    ssr: false,
    fetchPolicy: 'network-only',
  },
})(ComponentUsingHOC);

ComponentUsingHOC.whyDidYouRender = true

export default WithHOC;