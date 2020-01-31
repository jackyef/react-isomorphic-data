---
id: caching
title: Caching
sidebar_label: Caching
description: 'Explanation about different caching strategy in react-isomorphic-data'
---

All `GET` requests, either lazy or non-lazy ones, can be cached. By default, `react-isomorphic-data` will use `cache-first` strategy for all the data. This means that if a response for a particular URL + query params already exist in the cache, all subsequent requests will always receive a response from the cache directly, without going to the network. 

## Caching Strategies
`react-isomorphic-data` comes with 3 different caching strategies, which you can choose by passing a `dataOptions.fetchPolicy` to your hook/HOC. [(More about dataOptions)](./data-options.md)

1. `cache-first`

    This is the default strategy used if you do not pass an explicit `fetchPolicy`. A network request will only be made if the particular URL + query params' response does not exist in the cache yet. 
    
    If it exists in the cache, the data from cache will be passed to your component and a network request will never be made.

2. `cache-and-network`

    If data exists in cache, it will be passed to your component immediately. It will also make a request to the network to get a fresh data. Once the network request is resolved, the data in the cache will be updated with the newer data.

3. `network-only`

    The data will never be cached. Each data will only be kept until the component unmount, or until another network request is made explicitly. All non `GET` requests (`POST`, `PUT`, `DELETE`, etc.) are locked in to this strategy.

## Things to note
1. `network-only` strategy should not be used for data that are going to be fetched during server side rendering. The reason for this is because it's going to be invalidated (become `null`) the moment your React app hydrates on the client side. Doing so in development mode will show a warning message in the console. [An issue](https://github.com/jackyef/react-isomorphic-data/issues/14) for this has been opened in the repo, and will be looked at in the near future.

2. All non `GET` requests are locked in to `network-only` strategy. The reason for this is because non `GET` requests are not expected to be idempotent (calling them will introduces side-effects on the server side), and therefore should not be cached.