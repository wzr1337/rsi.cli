# RSI (RESTful Service Interface) command line interface

<center>

![RSI.cli](https://raw.githubusercontent.com/wzr1337/rsi.cli/master/assets/logo.png)

</center>

The swiss army knife for RSI related tasks.

This project supports the RESTful Service Interface as published under [https://www.w3.org/Submission/2016/01/](https://www.w3.org/Submission/2016/01/). 

The framework proposes a slightly out-of-date JSON schema for service definitions, so this module uses the service schema published under https://github.com/wzr1337/rsi.schema

## Installation

To install the cli globally run the following command:

```bash
$ npm i -g rsi.cli
```

*this assumes you used git to access gitlab before*

## Usage

Usage: `rsi <commands...> [options...]`


**options**

  -v, --version    Print the version.
  -h, --help       Print this usage guide.

**commands**

  service   operate on service level


### service

  Usage: `rsi service <commands...>`

**commands**

  release    prepare service for release
  init       initialize a new repository
  validate   validate src/schema.json

 #### init

  Usage: `rsi service <commands...>`

**options**

  ...
