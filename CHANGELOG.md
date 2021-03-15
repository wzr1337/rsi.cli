<a name="0.4.4"></a>
## [0.4.4](https://github.com/wzr1337/rsi.cli/compare/v0.4.3...v0.4.4) (2021-03-15)


### Bug Fixes

* **service.init:** fixes .gitignore missing issue with newer npm version ([951441f](https://github.com/wzr1337/rsi.cli/commit/951441f))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/wzr1337/rsi.cli/compare/v0.4.2...v0.4.3) (2021-03-15)


### Bug Fixes

* **general:** re-add dist folder ([b4a9cbe](https://github.com/wzr1337/rsi.cli/commit/b4a9cbe))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/wzr1337/rsi.cli/compare/v0.4.1...v0.4.2) (2020-11-10)


### Bug Fixes

* **document:** can no render html document and markdowm for a single service ([57305e0](https://github.com/wzr1337/rsi.cli/commit/57305e0))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/wzr1337/rsi.cli/compare/v0.4.0...v0.4.1) (2020-04-09)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/wzr1337/rsi.cli/compare/0.4.0...v0.4.0) (2020-04-09)


### Bug Fixes

* **cli:** fixed a typo ([8c5145f](https://github.com/wzr1337/rsi.cli/commit/8c5145f))
* **init:** changed author to an object rather than a string ([6ba47ee](https://github.com/wzr1337/rsi.cli/commit/6ba47ee))
* **init/package:** when using init, author was coming out as [object Object], corrected issue, passing correct data ([42d8484](https://github.com/wzr1337/rsi.cli/commit/42d8484))
* **sideNav:** was referencing the same general information and changelog ([3aa4fcd](https://github.com/wzr1337/rsi.cli/commit/3aa4fcd))
* **template:** changed schema to service definitions ([0132030](https://github.com/wzr1337/rsi.cli/commit/0132030))
* **template:** changed schema to service definitions ([c934408](https://github.com/wzr1337/rsi.cli/commit/c934408))
* **testing:** fixed test methods and updated them with refactor ([2d95c86](https://github.com/wzr1337/rsi.cli/commit/2d95c86))


### Features

* **changelog:** cli can now find changelog of bundle and include it in documentation ([109eb1f](https://github.com/wzr1337/rsi.cli/commit/109eb1f))
* **document:** can now create a single document for bundles ([e4876b6](https://github.com/wzr1337/rsi.cli/commit/e4876b6))
* **html template:** redisigned it with collapsable sections ([e179dae](https://github.com/wzr1337/rsi.cli/commit/e179dae))
* **markdown:** combined document func with markdown, now can do both in one, and now can generate just markdowns ([8fa4320](https://github.com/wzr1337/rsi.cli/commit/8fa4320))
* **readMe:** updated readme to specify bundle and bundle options ([1a30887](https://github.com/wzr1337/rsi.cli/commit/1a30887))
* **render:** can now render a class uml from a bundle with multiple services ([186480c](https://github.com/wzr1337/rsi.cli/commit/186480c))
* **SD and Schema:** now checks if serviceDefinition exists, if not use schema ([7ae420c](https://github.com/wzr1337/rsi.cli/commit/7ae420c))
* **TOC:** unified the table of contents, there is only one containing all resources and types for all services ([1e0fb9d](https://github.com/wzr1337/rsi.cli/commit/1e0fb9d))
* **validate:** can now validate multiple service definition in a bundle at one time ([7d51344](https://github.com/wzr1337/rsi.cli/commit/7d51344))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/wzr1337/rsi.cli/compare/v0.3.0...v0.3.1) (2019-12-14)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/wzr1337/rsi.cli/compare/0.2.5...v0.3.0) (2019-12-13)


### Bug Fixes

* **assets.repo:** fix a typo ([dd7135e](https://github.com/wzr1337/rsi.cli/commit/dd7135e))
* **service.document:** add missing documentation ([7be9a8b](https://github.com/wzr1337/rsi.cli/commit/7be9a8b))


### Features

* **service:** allows to generate HTML documentation ([0d7bbe4](https://github.com/wzr1337/rsi.cli/commit/0d7bbe4))



<a name="0.2.5"></a>
## [0.2.5](https://github.com/wzr1337/rsi.cli/compare/0.2.4...0.2.5) (2019-06-17)


### Bug Fixes

* **assests:** schema asset to use the right $schema reference ([41beee3](https://github.com/wzr1337/rsi.cli/commit/41beee3))


### Features

* **service:** use similar syntax for all commands, always acceptiong folder instead of file ([e7949ea](https://github.com/wzr1337/rsi.cli/commit/e7949ea))
* **service.init:** ask for missing config ([de44483](https://github.com/wzr1337/rsi.cli/commit/de44483))
* **service.markdown:** render Types into markdown ([36b81fe](https://github.com/wzr1337/rsi.cli/commit/36b81fe))
* **service.validate:** allow watching folder to revalidate ([f53f470](https://github.com/wzr1337/rsi.cli/commit/f53f470))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/wzr1337/rsi.cli/compare/0.2.3...0.2.4) (2019-06-14)


### Bug Fixes

* **service.init:** missing parameters in init lead to help print out ([a358e1f](https://github.com/wzr1337/rsi.cli/commit/a358e1f))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/wzr1337/rsi.cli/compare/0.2.2...0.2.3) (2019-06-13)


### Features

* **service.render:** rendering types with properties ([4ea8b94](https://github.com/wzr1337/rsi.cli/commit/4ea8b94))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/wzr1337/rsi.cli/compare/0.2.1...0.2.2) (2019-06-09)


### Bug Fixes

* **service.render:** properly rendering references for properties of type array ([392d7f2](https://github.com/wzr1337/rsi.cli/commit/392d7f2))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/wzr1337/rsi.cli/compare/0.2.0...0.2.1) (2019-06-09)


### Features

* **service.render:** you can now watch your source files to re-render the puml using the --watch flag ([1d23f2b](https://github.com/wzr1337/rsi.cli/commit/1d23f2b))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/wzr1337/rsi.cli/compare/0.1.3...0.2.0) (2019-02-21)


### Documentation

* **README.MD:** add more usage documentation ([4650441](https://github.com/wzr1337/rsi.cli/commit/4650441))


### Features

* **ci:** add travisci ([f13371e](https://github.com/wzr1337/rsi.cli/commit/f13371e))


### BREAKING CHANGES

* **README.MD:** The render command now expects a source folder instead a file name



<a name="0.1.3"></a>
## [0.1.3](https://github.com/wzr1337/rsi.cli/compare/0.1.1...0.1.3) (2018-12-20)


### Bug Fixes

* **readme:** use raw url for cli icon ([5ea8b98](https://github.com/wzr1337/rsi.cli/commit/5ea8b98))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/wzr1337/rsi.cli/compare/0.1.0...0.1.1) (2018-12-20)



<a name="0.1.0"></a>
# 0.1.0 (2018-12-20)



