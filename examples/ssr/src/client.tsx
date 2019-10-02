import React from 'react';
import { hydrate } from 'react-dom';
import { DataProvider, createDataClient } from 'react-isomorphic-data';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

declare global {
  interface Window { __cache: any; }
}

const dataClient = createDataClient({
  initialCache: window.__cache,
  ssr: false,
});

hydrate(
  <DataProvider client={dataClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DataProvider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}