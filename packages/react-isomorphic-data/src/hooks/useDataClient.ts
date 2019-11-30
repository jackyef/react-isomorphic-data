import * as React from 'react';
import DataContext from '../common/Context';

const useDataClient = () => {
  const context = React.useContext(DataContext);

  return context.client;
}

export default useDataClient;
