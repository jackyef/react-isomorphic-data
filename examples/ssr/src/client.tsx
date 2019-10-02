import React from 'react';
import { hydrate } from 'react-dom';
import { DataProvider } from 'react-isomorphic-data';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

const initialData = {};

hydrate(
  <DataProvider initialData={initialData}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DataProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}