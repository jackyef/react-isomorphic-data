import * as React from 'react';

import { DataContextAPI } from './types';

const DataContext = React.createContext<DataContextAPI | null>(null);

export default DataContext;
