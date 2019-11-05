---
id: intro
title: Introduction
sidebar_label: Introduction
---

`react-isomorphic-data` is heavily inspired by `react-apollo`. The main purpose of it is to allow developers to write React components that can declare its own data requirement in the component itself, with SSR support as well!

NOTE: This project is still very much work in progress, use at your own risk ⚠️

### Features
- React hooks 
- SSR support
- Simple built-in cache

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