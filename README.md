# RSI (RESTful Service Interface) command line interface

<center>

![RSI.cli](https://github.com/wzr1337/rsi.cli/blob/master/assets/logo.png)

</center>

The swiss army knife for RSI related tasks.

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