---
id: rendertostringwithdata
title: renderToStringWithData()
sidebar_label: renderToStringWithData()
---

## `renderToStringWithData()`
Params
* `tree: React.ReactElement`
* `dataClient: DataClient`

This function return a `Promise` that will resolve to a `string`, containing the markup for the React app.

### Usage
Following is an example of SSR implementation using `express` web server.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import express from 'express';
import { DataProvider, createDataClient, renderToStringWithData } from 'react-isomorphic-data';
import fetch from 'node-fetch';

import App from './App';

// react-isomorphic-data needs fetch to be available in the global scope
global.fetch = fetch;

express.get('/*', async (req, res) => {
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
    markup = await renderToStringWithData(tree, dataClient);
  } catch (err) {
    console.error('An error happened during server side rendering!');
  }

  res.send(`
    <html>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `);
}
```
