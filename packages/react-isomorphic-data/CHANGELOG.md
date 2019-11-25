# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.11.2](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.11.1...react-isomorphic-data@0.11.2) (2019-11-25)


### Bug Fixes

* fixed a bug where loading is true when data already exist from SSR ([4a3c688](https://github.com/jackyef/react-isomorphic-data/commit/4a3c688a29d4b318d22737f918d4ef8eb5cd1c7c))





## [0.11.1](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.11.0...react-isomorphic-data@0.11.1) (2019-11-24)


### Bug Fixes

* remove suspense-related stuffs for now ([4a3de1d](https://github.com/jackyef/react-isomorphic-data/commit/4a3de1d71b823bc0cd265403f6c49e2591a35bd8))





# [0.11.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.10.0...react-isomorphic-data@0.11.0) (2019-11-24)


### Features

* Support for Suspense :tada: ([#17](https://github.com/jackyef/react-isomorphic-data/issues/17)) ([5cf689e](https://github.com/jackyef/react-isomorphic-data/commit/5cf689e68c09c20369232e16e1ec1aef8c8e5c1f))





# [0.10.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.9.0...react-isomorphic-data@0.10.0) (2019-11-17)


### Features

* added capabilities to create link prefetch tags automatically during SSR ([d5145ae](https://github.com/jackyef/react-isomorphic-data/commit/d5145aed9d8a7fa29f2d81ef1d528652429fb704))





# [0.9.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.8.0...react-isomorphic-data@0.9.0) (2019-11-12)


### Features

* separate `ssr` utilities to its own bundle ([d2d78db](https://github.com/jackyef/react-isomorphic-data/commit/d2d78db1b815c1e2b3127ae857b6b33ab255dc25))


### BREAKING CHANGES

* `renderToStringWithData` and `getDataFromTree` can now be imported from `react-isomorphic-data/ssr` instead of `react-isomorphic-data`





# [0.8.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.7.0...react-isomorphic-data@0.8.0) (2019-11-05)


### Features

* **ssr:** added `renderToStringWithData` for SSR use cases ([7029043](https://github.com/jackyef/react-isomorphic-data/commit/702904328a09de2324f92e32290fc1551b30d181))





# [0.7.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.6.1...react-isomorphic-data@0.7.0) (2019-11-02)


### Bug Fixes

* **usebasedata:** fixed a subtle bug where exact same requests are fetched multiple time during SSR ([9c37936](https://github.com/jackyef/react-isomorphic-data/commit/9c3793620be187feac71d094fd9d1a14106f6d6a))
* **usebasedata:** fixed issue where multiple same request could be sent when another is in flight ([eb6af37](https://github.com/jackyef/react-isomorphic-data/commit/eb6af3768b140b89d7d2abf553c7b4dfcba9b33d))


### Features

* **react-isomorphic-data:** added dataOptions that allows component to skip ssr for some data ([91b5843](https://github.com/jackyef/react-isomorphic-data/commit/91b58430a6995d051de6850e6882e84dcfadfda5))
* **react-isomorphic-data:** added fetchPolicy for finer control on how data should be cached ([8c0cd67](https://github.com/jackyef/react-isomorphic-data/commit/8c0cd67ce6c106ff7ae507008ed1dce0a4bb2ae0))
* added refetch() that will always bypass cache ([f62126f](https://github.com/jackyef/react-isomorphic-data/commit/f62126fe96c391b5a18e3f794118eb4fd8cdd1ec))


### Performance Improvements

* **react-isomorphic-data:** added rollup replacer plugin for better minification ([894f419](https://github.com/jackyef/react-isomorphic-data/commit/894f419f914893b7e30f758bb1baa3656a3d81f4))





## [0.6.1](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.6.0...react-isomorphic-data@0.6.1) (2019-10-16)

**Note:** Version bump only for package react-isomorphic-data





# [0.6.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.5.1...react-isomorphic-data@0.6.0) (2019-10-16)


### Bug Fixes

* **react-isomorphic-data:** fix the typings for `error` ([468d9df](https://github.com/jackyef/react-isomorphic-data/commit/468d9df))


### Features

* **react-isomorphic-data:** support non-GET requests lazily ([1e42d59](https://github.com/jackyef/react-isomorphic-data/commit/1e42d59))





## [0.5.1](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.5.0...react-isomorphic-data@0.5.1) (2019-10-06)

**Note:** Version bump only for package react-isomorphic-data





# [0.5.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.4.1...react-isomorphic-data@0.5.0) (2019-10-06)


### Features

* **react-isomorphic-data:** added options to add headers for all fetches with the same DataClient ([6184395](https://github.com/jackyef/react-isomorphic-data/commit/6184395))





## [0.4.1](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.4.0...react-isomorphic-data@0.4.1) (2019-10-03)


### Bug Fixes

* **react-isomorphic-data:** fix package not built before publishing ([379e2b5](https://github.com/jackyef/react-isomorphic-data/commit/379e2b5))





# [0.4.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.3.0...react-isomorphic-data@0.4.0) (2019-10-03)


### Bug Fixes

* **react-isomorphic-data:** fix SSR was doing more renders than necessary ([05b47ca](https://github.com/jackyef/react-isomorphic-data/commit/05b47ca))
* **usebasedata:** fix `error` sometimes can be null, and sometimes can be false ([0ee87ad](https://github.com/jackyef/react-isomorphic-data/commit/0ee87ad))


### Features

* **react-isomorphic-data:** added HOCs withData and withLazyData :tada: ([1f432e3](https://github.com/jackyef/react-isomorphic-data/commit/1f432e3))





# [0.3.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.2.2...react-isomorphic-data@0.3.0) (2019-10-02)


### Features

* **react-isomorphic-data:** improve bundlesize by removing react-dom/server out of bundle ([0e9c10a](https://github.com/jackyef/react-isomorphic-data/commit/0e9c10a))


### Performance Improvements

* **react-isomorphic-data:** fix build script so the output is minimized for prod build ([440344f](https://github.com/jackyef/react-isomorphic-data/commit/440344f))





## [0.2.2](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.2.1...react-isomorphic-data@0.2.2) (2019-10-02)

**Note:** Version bump only for package react-isomorphic-data





## [0.2.1](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.2.0...react-isomorphic-data@0.2.1) (2019-10-02)


### Bug Fixes

* **react-isomorphic-data:** fix wrong dependencies list in package.json ([c47df30](https://github.com/jackyef/react-isomorphic-data/commit/c47df30))





# [0.2.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.1.0...react-isomorphic-data@0.2.0) (2019-10-02)


### Features

* **examples/ssr:** setup SSR-capable react app using razzle ([#1](https://github.com/jackyef/react-isomorphic-data/issues/1)) ([3f76d9d](https://github.com/jackyef/react-isomorphic-data/commit/3f76d9d))





# 0.1.0 (2019-09-27)


### Features

* **package:** restructure repo into a monorepo using lerna + yarn workspace ([6ae329e](https://github.com/jackyef/react-isomorphic-data/commit/6ae329e))
