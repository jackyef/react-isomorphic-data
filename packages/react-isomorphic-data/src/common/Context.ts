import * as React from 'react';

const DataContext = React.createContext<DataContextAPI>({
  cache: {},
  addToCache: () => {},
});

export default DataContext;
