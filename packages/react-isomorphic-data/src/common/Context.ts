import * as React from 'react';

import { createDataClient } from './Client';

import { DataContextAPI } from './types';

const DataContext = React.createContext<DataContextAPI>({
  client: createDataClient({}),
  addToCache: () => {},
});

export default DataContext;
