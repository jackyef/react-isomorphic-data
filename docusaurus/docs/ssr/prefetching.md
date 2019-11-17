---
id: prefetching
title: Prefetching
sidebar_label: Prefetching
---

`react-isomorphic-data` provide helper function to inject `<link rel="prefetch">` tags in to the server-side rendered HTML. This is done to give hints to the browser that the particular resource should be prefetched. Prefetched resources have a very low priority and will only be run when the browser is idle. Prefetching resources could improve performance because when the resource is requested, it might already be ready in the prefetch cache. More about prefetch [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Link_prefetching_FAQ).

In general, you should prefetch data that you think will have a high possibility to be requested by the page.

## Example
First, make sure you have are setting `dataOptions.prefetch` to true for some of your data. 
```javascript
const [fetchData, lazyData] = useLazyData(
  'http://localhost:3000/some-rest-api/23',
  {},
  {},
  {
    fetchPolicy: 'cache-first',
    ssr: false,
    prefetch: true,
  },
);
```

Then, in your server side rendering code, you can `createPrefetchTags` from the `dataClient` after you have done `renderToStringWithData` or `getDataFromTree`. Finally, put the `prefetchTags` into the `<head>` of your HTML response.

*(shortened example)*
```javascript
import { renderToStringWithData, createPrefetchTags } from 'react-isomorphic-data/ssr';

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

  const prefetchTags = createPrefetchTags(dataClient);

  res.send(`
    <html>
      <head>${prefetchTags}</head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `);
}
```

## Note
Setting `prefetch` to `true` for data that are going to be requested during SSR (i. e.: not lazy and has `ssr` set to `true`) can be detrimental. This is because the data would already be ready in the `react-isomorphic-data` cache upon doing [client-side hydration](./client-side-hydration.md), so prefetching it again is an unnecessary extra network request.