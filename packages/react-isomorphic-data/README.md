# react-isomorphic-data
Easily fetch data from a GET request in your React components, with similar APIs to [react-apollo](https://github.com/apollographql/react-apollo/) 🎉

You can use hooks or HOC, both are supported. 🎉

NOTE: This project is still very much work in progress, use at your own risk ⚠️

### Features
- React hooks 
- SSR support
- Simple built-in cache

### Installing
```
yarn add react-isomorphic-data
```

### Example
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
import { DataProvider, createDataClient, getDataFromTree } from 'react-isomorphic-data';
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
```

### Future features
- [ ] More fine tuned options for cache policy, fetch policy, etc.
- [ ] Better error handling
- [ ] Better documentation
- [ ] Multi-package structure so we can separate HOC stuffs to decrease bundlesize. Currently, HOCs require hoist-non-react-static which increase our bundle size.

Feel free to open an issue if you have something in mind!
