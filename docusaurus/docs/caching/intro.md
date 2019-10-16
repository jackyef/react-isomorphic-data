---
id: intro
title: Caching
sidebar_label: Introduction
---

All `GET` requests are cached automatically. Currently, `react-isomorphic-data` only support the `cache-first` strategy. This means that if a response for a particular URL + query params already exist in the cache, all subsequent requests will always receive a response from the cache directly, without going to the network. 

A more fine-tuned control for bypassing the cache will be available in the future. This docs will be filled with more content once it has been implemented.

Support for caching other HTTP methods is not currently in the plan.