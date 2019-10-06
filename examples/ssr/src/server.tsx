import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { DataProvider, createDataClient, getDataFromTree } from 'react-isomorphic-data';
import { StaticRouter } from 'react-router-dom';
import fetch from 'node-fetch';
import compression from 'compression';

import App from './App';

// hack for augmenting fetch to global
const globalAny: any = global;
globalAny.fetch = fetch;

let assets: any;

const syncLoadAssets = () => {
  // eslint-disable-next-line
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const server = express()
  .disable('x-powered-by')
  // eslint-disable-next-line
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .use(compression())
  .get('/*', async (req: express.Request, res: express.Response) => {
    const context = {};

    // create a dataClient instance
    const dataClient = createDataClient({ 
      initialCache: {}, 
      ssr: true, 
      headers: {
        // forward headers from client to the REST API (such as Cookies)
        cookies: req.header('cookie'),
        'my-custom-header': 'will be sent on all requests',
    }});
    
    // pass it to the DataProvider
    const reactApp = (
      <DataProvider client={dataClient}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </DataProvider>
    );

    // pass the same dataClient instance you are passing to your provider here
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
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        <script>
          window.__cache=${JSON.stringify(dataClient.cache)}
        </script>
          ${
            process.env.NODE_ENV === 'production'
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
    );
  });

export default server;