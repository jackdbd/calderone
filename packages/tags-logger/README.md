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
  - [structured logging](#structured-logging)
  - [unstructured logging](#unstructured-logging)
- [Configuration](#configuration)
  - [Environment variables](#environment-variables)
  - [Options](#options)
- [API](#api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Features

- **tags** to pinpoint the log statements you are actually interested in.
- **optional validation** of all log statements with [Joi](https://github.com/sideway/joi).
- **easy switching** bewteen structured/unstructured logging.

## Installation

```sh
npm install @jackdbd/tags-logger
```

## Usage

### structured logging

When you write this:

```ts
import makeLog from '@jackdbd/tags-logger'

const log = makeLog()

log({
  message: 'something not very important about foo and bar',
  tags: ['debug', 'foo', 'bar']
})

log({
  message: 'something of critical importance about baz',
  tags: ['critical', 'baz']
})
```

You get this:

```sh
{
  "severity": "DEBUG",
  "message": "something not very important about foo and bar",
  "tags": ["bar", "foo"],
  "tag": {"bar": true, "foo": true}
}

{
  "severity": "CRITICAL",
  "message": "something of critical importance about baz",
  "tags": ["baz"],
  "tag": {"baz": true}
}
```

### unstructured logging

When you write this:

```ts
import makeLog from '@jackdbd/tags-logger'

const log = makeLog({
  namespace: 'my-app/my-module'
})

// same log statements as above
```

You get this (but with colors):

```sh
my-app/my-module [🔍 bar,foo] something not very important about foo and bar +0ms

my-app/my-module [🔥 baz] something of critical importance about baz +0ms
```

Don't like emojis? Then write this:

```ts
import makeLog from '@jackdbd/tags-logger'

const log = makeLog({
  namespace: 'my-app/my-module',
  should_use_emoji_for_severity: false // <--
})

// same log statements as above
```

And get this (but with colors):

```sh
my-app/my-module [debug bar,foo] something not very important about foo and bar +0ms

my-app/my-module [critical baz] something of critical importance about baz +0ms
```

## Configuration

### Environment variables

| Environment variable | Explanation |
| --- | --- |
| `DEBUG` | You must set this environment variable if you want to use unstructured logging and see some output. This library delegates unstructured logging to [debug](https://github.com/debug-js/debug).

### Options

| Option | Default | Explanation |
| --- | --- | --- |
| `namespace` | `undefined` | The namespace for unstructured logging. This option has no effect when using structured logging. |
| `should_use_emoji_for_severity` | `true` | Whether to use an emoji for the severity level, when using unstructured logging. This option has no effect when using structured logging. |
| `should_validate_log_statements` | `true` | Whether each log statement should be validated against a [Joi](https://github.com/sideway/joi) schema. |

## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/tags-logger/)
