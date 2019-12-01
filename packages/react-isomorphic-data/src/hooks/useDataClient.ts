import * as React from 'react';
import DataContext from '../common/Context';

const useDataClient = () => {
  const context = React.useContext(DataContext);

  if (!context) throw new Error('DataContext is null. Make sure you are wrapping your app inside DataProvider');

  return context.client;
}

export default useDataClient;
