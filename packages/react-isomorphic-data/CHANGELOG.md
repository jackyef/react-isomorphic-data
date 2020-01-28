# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.14.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.13.1...react-isomorphic-data@0.14.0) (2020-01-28)


### Features

* implementation of subscription model for more precise re-render ([b27a7d2](https://github.com/jackyef/react-isomorphic-data/commit/b27a7d242eb6a37d32c38efe1bb9c6fd9b415c51))


### Performance Improvements

* initial commit for subscription model rework ([8ca05df](https://github.com/jackyef/react-isomorphic-data/commit/8ca05df3e46e25332d8ae6e6bcc6cbd9c289a568))





## [0.13.1](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.13.0...react-isomorphic-data@0.13.1) (2020-01-24)

**Note:** Version bump only for package react-isomorphic-data





# [0.13.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.12.5...react-isomorphic-data@0.13.0) (2020-01-16)


### Features

* **testing:** init package for testing utilities ([7fb8667](https://github.com/jackyef/react-isomorphic-data/commit/7fb866779f1da681c6a2db5721618e65c3ac34c9))





## [0.12.5](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.12.4...react-isomorphic-data@0.12.5) (2019-12-25)

**Note:** Version bump only for package react-isomorphic-data





## [0.12.4](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.12.3...react-isomorphic-data@0.12.4) (2019-12-11)


### Bug Fixes

* loading was not set to true when re-fetching ([982fff3](https://github.com/jackyef/react-isomorphic-data/commit/982fff3aecd01fa3eed96a3eb7fcf4d66de55076))
* remove errors when fetch succeeded ([15374b3](https://github.com/jackyef/react-isomorphic-data/commit/15374b347c3205650919e8c39edcbf203f69131c))





## [0.12.3](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.12.2...react-isomorphic-data@0.12.3) (2019-12-01)


### Bug Fixes

* fix initialLoading is true even when the data is skipped ([484573a](https://github.com/jackyef/react-isomorphic-data/commit/484573ae2c0d53ecd5c351bef83f3a0fcb7f8be8))





## [0.12.2](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.12.1...react-isomorphic-data@0.12.2) (2019-12-01)

**Note:** Version bump only for package react-isomorphic-data





## [0.12.1](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.12.0...react-isomorphic-data@0.12.1) (2019-11-30)


### Bug Fixes

* fix case where an error will block all further fetch ([b59efa4](https://github.com/jackyef/react-isomorphic-data/commit/b59efa44c70fd405806133744a1944d340a90dc6))





# [0.12.0](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.11.6...react-isomorphic-data@0.12.0) (2019-11-30)


### Bug Fixes

* fix a bug where updating state does not trigger re-fetch ([6623b4f](https://github.com/jackyef/react-isomorphic-data/commit/6623b4f76993224d2cc29294e564ca775e2480f5))


### Features

* **suspense:** added support for network-only fetchPolicy for preloadData ([b220846](https://github.com/jackyef/react-isomorphic-data/commit/b22084688d07f7cbc4b0da81a1fca8628653266d))
* added withDataClient HOC ([03f78a0](https://github.com/jackyef/react-isomorphic-data/commit/03f78a0408b15ac165ab9690b7ee7e43e9859460))
* initial setup for Suspense ([b81f96c](https://github.com/jackyef/react-isomorphic-data/commit/b81f96cf52ee3d3a081057db5da5e19c726ce669))





## [0.11.6](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.11.5...react-isomorphic-data@0.11.6) (2019-11-26)


### Bug Fixes

* fix a bug where an error will cause infinite retries ([61b358b](https://github.com/jackyef/react-isomorphic-data/commit/61b358bc988dcf8ea80d332600aa1940fb55b052))





## [0.11.5](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.11.4...react-isomorphic-data@0.11.5) (2019-11-26)


### Bug Fixes

* fixed a bug where loading stays true on error ([f19ae57](https://github.com/jackyef/react-isomorphic-data/commit/f19ae574a656efedf6708cdbf9c7ed1bd4ea126c))





## [0.11.4](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.11.3...react-isomorphic-data@0.11.4) (2019-11-25)


### Bug Fixes

* allow fetchOptions to change between render ([62c4f73](https://github.com/jackyef/react-isomorphic-data/commit/62c4f73aa9e248db5b2159aa33e3aa0172f4aecb))





## [0.11.3](https://github.com/jackyef/react-isomorphic-data/compare/react-isomorphic-data@0.11.2...react-isomorphic-data@0.11.3) (2019-11-25)


### Bug Fixes

* fix a bug where lazy data are fetched immediately ([9c8d699](https://github.com/jackyef/react-isomorphic-data/commit/9c8d699e267c6df0661c021e3d66adae2fd400a3))





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
