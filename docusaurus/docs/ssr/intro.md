---
id: intro
title: Introduction
sidebar_label: Introduction
description: 'Server-side rendering with react-isomorphic-data'
---

Server-side rendering (SSR) is a technique that renders a React app on the server, and send down the resulting HTML to the client. This is done to allow user to see something on their screen earlier, and also can help with SEO related stuffs. Here is a great article about [rendering on the web](https://developers.google.com/web/updates/2019/02/rendering-on-the-web) from Google.

When your React app relies on data from other services, SSR becomes a harder problem. This is because you will need to fetch all the data before rendering your React app. `react-isomorphic-data` covers this use case by providing functions that you can just use right away in [`renderToStringWithData()`](./renderToStringWithData.md) and [`getDataFromTree()`](./getDataFromTree.md)

`react-isomorphic-data` also supports [client-side hydration](./client-side-hydration.md) if you want to hydrate your app on the client side.

## Example
Simple example with `express` web server.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import express from 'express';
import { DataProvider, createDataClient } from 'react-isomorphic-data';
import { renderToStringWithData } from 'react-isomorphic-data/ssr';
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