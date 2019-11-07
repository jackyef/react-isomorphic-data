---
id: client-side-hydration
title: Client-side Hydration
sidebar_label: Client-side Hydration
---

If your app will be re-hydrated on the client side, you should serialise the cache to HTML, so that it can be reused on the client side. For now, you can do that by just calling `JSON.stringify` on the `dataClient.cache`. 

### Serialising on the server side
```javascript
const dataClient = createDataClient({
  initialCache: {},
  ssr: true, // set this to true on server side
});

const tree = (
  <DataProvider client={dataClient}>
    <App />
  </DataProvider>
);

let markup;

try {
  await getDataFromTree(tree, dataClient);
  markup = renderToString(tree);
} catch (err) {
  console.error('An error happened during server side rendering!');
}

res.send(`
  <html>
    <body>
      <div id="root">${markup}</div>
    </body>
    <script>window.__cache=${JSON.stringify(dataClient.cache)}</script>
  </html>
`);
```

### Re-using the cache on the client side
Simply use the `window.__cache` variable (or whatever the variable name you store the serialised data to), as the `initialCache` when doing `createDataClient()`.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { DataProvider, createDataClient } from 'react-isomorphic-data';

import App from './App';

const dataClient = createDataClient({
  initialCache: window.__cache || {},
  ssr: false,
});

ReactDOM.render(
  <DataProvider client={dataClient}>
    <App />
  </DataProvider>,
  document.getElementById('root')
);
```

