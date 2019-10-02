import * as React from 'react';

import DataContext from './Context';

import { DataContextAPI } from './types';

/**
 * We only cache GET requests, because deep checking request body on POST request is not ideal.
 */
interface DataProviderProps {
  children: JSX.Element[] | JSX.Element;
  initialData: Record<string, any>;
};

const DataProvider: React.FC<DataProviderProps> = ({ children, initialData = {} }) => {
  const [cache, setCache] = React.useState<Record<string, any>>(initialData);

  const addToCache = (key: string, value: any) => {
    setCache(prevCache => ({
      ...prevCache,
      [key]: value,
    }));
  };

  const injectedValues: DataContextAPI = {
    cache,
    addToCache,
  };

  return <DataContext.Provider value={injectedValues}>{children}</DataContext.Provider>;
};

export default DataProvider;
