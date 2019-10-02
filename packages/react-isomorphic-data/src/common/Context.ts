import * as React from 'react';

import { DataContextAPI } from './types';

const DataContext = React.createContext<DataContextAPI>({
  cache: {},
  addToCache: () => {},
});

export default DataContext;
