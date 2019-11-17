import * as React from 'react';

import { createDataClient } from './Client';

import { DataContextAPI } from './types';

const DataContext = React.createContext<DataContextAPI>({
  client: createDataClient({}),
  addToCache: (_key: string, _value: any) => {},
  addToBePrefetched: (_url: string) => {},
});

export default DataContext;
