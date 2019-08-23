import * as React from 'react';

/**
 * We only cache GET requests, because deep checking request body on POST request is not ideal.
 */

const DataContext = React.createContext<DataContextAPI>({
  cache: {},
  addToCache: () => {},
});

export default DataContext;
