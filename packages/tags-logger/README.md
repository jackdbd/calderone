# @jackdbd/tags-logger

[![npm version](https://badge.fury.io/js/@jackdbd%2Ftags-logger.svg)](https://badge.fury.io/js/@jackdbd%2Ftags-logger)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Ftags-logger)

A logger inspired by [how logging is implemented in Hapi.js](https://hapi.dev/tutorials/logging/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
  - [Options](#options)
- [API](#api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Features

- **automatic switch** bewteen a [debug](https://github.com/debug-js/debug) logger when running in development, and a JSON logger when running on Google Cloud Platform.
- **tags** to pinpoint the log statements you are actually interested in.
- **optional validation** of all log statements with [Joi](https://github.com/sideway/joi).

## Installation

```sh
npm install @jackdbd/tags-logger
```

## Usage

```ts
import makeLogger from '@jackdbd/tags-logger'

const logger = makeLogger()

logger.log({
  message: 'something not very important about foo and bar',
  tags: ['debug', 'foo', 'bar']
})

logger.log({
  message: 'something of critical importance about baz',
  tags: ['critical', 'baz']
})
```

## Configuration

### Environment variables

| Environment variable | Explanation |
| --- | --- |
| `DEBUG` | You must set this environment variable if you want to use the [debug](https://github.com/debug-js/debug) logger. Since you might be interested in logging many *namespaces* (see below: `namespace` option), you can set a space or comma-delimited value. *E.g.* `DEBUG=some-namespace,other-namespace`. It has no effect when logging with the JSON logger. |
| `LOGGER_TAGS` | This environment variable controls which tags to log with the debug logger. If not set, the logger logs **all** tags. If in your app you have the tags `foo`, `bar` and `baz`, and you want to log only `foo` and `bar`, set `LOGGER_TAGS=foo,bar`. It has no effect when logging with the JSON logger. |

### Options

| Option | Default | Explanation |
| --- | --- | --- |
| `namespace` | `app` | The namespace for the [debug](https://github.com/debug-js/debug) logger. This option has no effect on the JSON logger. |
| `should_log_warning_if_namespace_not_in_DEBUG` | `true` | Whether the debug logger should log a warning when the `namespace` string is not included in the `DEBUG` environment variable. This option has no effect on the JSON logger. |
| `should_throw_if_namespace_not_in_DEBUG` | `false` | Whether the debug logger should throw an error when the `namespace` string is not included in the `DEBUG` environment variable. This option has no effect on the JSON logger. |
| `should_use_json_logger` | `true` if on Google Cloud, otherwise `false` | Whether the JSON logger should be used, instead of the debug logger. |
| `should_validate_log_statements` | `true` | Whether each log statement should be validated against a [Joi](https://github.com/sideway/joi) schema. |
| `statement_schema` | See [schemas.ts](./src/schemas.ts) | The Joi schema used to validate each log statement. It has effect only when `should_validate_log_statements` is `true`. |



## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/tags-logger/)
