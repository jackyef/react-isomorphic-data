import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DataProvider } from 'react-isomorphic-data';
import App from './App.tsx';

import './styles.css';

const initialData = {}; // We will be able to restore serialized data from SSR here later

ReactDOM.render(
  <DataProvider initialData={initialData}>
    <App />
  </DataProvider>,
  document.getElementById('root'),
);
