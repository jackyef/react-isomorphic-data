import React from 'react';
import { hydrate } from 'react-dom';
import { useData, DataProvider, createDataClient } from 'react-isomorphic-data';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

// @ts-ignore
import whyDidYouRender from '@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js' ;

const IsoData = { useData };
whyDidYouRender(React, {trackExtraHooks: [
  [IsoData, 'useData'],
]});

declare global {
  interface Window {
    __cache: any;
  }
}

const dataClient = createDataClient({
  initialCache: window.__cache,
  ssr: false,
  ssrForceFetchDelay: 1000,
  headers: {
    'x-foo': 'bar',
  }
});

hydrate(
  <DataProvider client={dataClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DataProvider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
