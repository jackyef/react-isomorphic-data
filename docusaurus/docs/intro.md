---
id: intro
title: Introduction
sidebar_label: Introduction
description: 'react-isomorphic-data is a library to handle JSON-formatted data in your react app, with full SSR support. It has similar APIs to react-apollo'
---

`react-isomorphic-data` is heavily inspired by `react-apollo`. The main purpose of it is to allow developers to write React components that can declare its own data requirement in the component itself, with SSR support as well!

NOTE: This project is still very much work in progress, use at your own risk ⚠️

### Features
- React hooks 
- SSR support with Suspense using [react-ssr-prepass](https://github.com/FormidableLabs/react-ssr-prepass) (No multi-rendering on the server!)
- Simple built-in cache
- TypeScript support
- [Testing utilities](./testing/writing-tests)
- React Suspense integration for implementing render-as-you-fetch pattern ⚠️ (experimental)

### Installing
```sh
yarn add react-isomorphic-data
```

### Setup
Simply create a `DataClient` instance and wrap your whole app inside the `DataProvider`...
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { DataProvider, createDataClient } from 'react-isomorphic-data';

import App from './App';

const dataClient = createDataClient({
  initialCache: {},
  ssr: false,
});

ReactDOM.render(
  <DataProvider client={dataClient}>
    <App />
  </DataProvider>,
  document.getElementById('root')
);
```

...and now you can use the hooks and HOCs inside your components 🎉

> ⚠️ Note:
> `react-isomorphic-data` depends on `fetch` and `Map` to exist in the `global` scope.
> You should be already polyfilling `Map` if you are using React, because React depends on it as well.
> You might need to polyfill `fetch` depending on your use case.