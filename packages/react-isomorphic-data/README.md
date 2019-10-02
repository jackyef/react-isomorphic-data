[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# react-isomorphic-data
Easily fetch data from a GET request in your React components, with similar APIs to [react-apollo](https://github.com/apollographql/react-apollo/) 🎉

Currently only use support react hooks.

NOTE: This project is still very much work in progress, use at your own risk ⚠️

### Features
- React hooks
- SSR support
- Simple built-in cache

### Example
```javascript
import React from 'react';
import { useData, useLazyData, DataProvider, createDataClient } from 'react-isomorphic-data';

const dataClient = createDataClient({
  initialCache: window.__cache,
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

##### SSR (example with express)
```javascript
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DataProvider, createDataClient, getDataFromTree } from 'react-isomorphic-data';
import fetch from 'node-fetch';

import App from './App';

// react-isomorphic-data needs fetch to be available in the global scope
global.fetch = fetch;

express.get('/*', async (req: express.Request, res: express.Response) => {
  const dataClient = createDataClient({ initialCache: {}, ssr: true });
  const reactApp = (
    <DataProvider client={dataClient}>
      <App />
    </DataProvider>
  );

  await getDataFromTree(reactApp, dataClient);

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
```

### Future features
- [ ] More fine tuned options for cache policy, fetch policy, etc.
- [ ] Higher-order-components support

Feel free to open an issue if you have something in mind!
