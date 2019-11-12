---
id: examples
title: Examples
sidebar_label: Examples
---

### Simple example with `useData` hook
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { useData, useLazyData, DataProvider, createDataClient } from 'react-isomorphic-data';

const dataClient = createDataClient({
  initialCache: window.__cache || {},
  ssr: false,
});

const Component = () => {
  const { data, loading } = useData('https://pokeapi.co/api/v2/pokemon/3/', {});

  return (
    <div>
      <h1>This is a Component.</h1>
      {loading ? (
        'loading...'
      ) : (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(
  <DataProvider client={dataClient}>
    <Component />
  </DataProvider>,
  document.getElementById('root')
);
```

### SSR example with express
```javascript
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DataProvider, createDataClient } from 'react-isomorphic-data';
import { getDataFromTree } from 'react-isomorphic-data/ssr';
import fetch from 'node-fetch';

import App from './App';

// react-isomorphic-data needs fetch to be available in the global scope
global.fetch = fetch;

express.get('/*', async (req: express.Request, res: express.Response) => {
  const dataClient = createDataClient({ 
    initialCache: {}, 
    ssr: true, 
    headers: {
      // forward headers from client to the REST API (such as cookies)
      'cookie': req.header('cookie'),
      'my-custom-header': 'will be sent on all requests',
  }});
  const reactApp = (
    <DataProvider client={dataClient}>
      <App />
    </DataProvider>
  );

  try {
    await getDataFromTree(reactApp, dataClient);
  } catch (err) {
    console.error('Error while trying to getDataFromTree', err);
  }

  const markup = renderToString(reactApp);

  res.send(
    `<!doctype html>
      <html lang="">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Razzle TypeScript</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
          window.__cache=${JSON.stringify(dataClient.cache)}
        </script>
      </head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>`
  );
}