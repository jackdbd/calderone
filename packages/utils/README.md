# @jackdbd/utils

[![npm version](https://badge.fury.io/js/@jackdbd%2Futils.svg)](https://badge.fury.io/js/@jackdbd%2Futils)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Futils)

Miscellaneous utility functions.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Installation](#installation)
- [API](#api)
- [Examples](#examples)
  - [@jackdbd/utils/array](#jackdbdutilsarray)
  - [@jackdbd/utils/logger](#jackdbdutilslogger)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/utils
```

## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/utils/)

## Examples

### @jackdbd/utils/array

```js
import {range, fisherYatesShuffle} from "@jackdbd/utils/array"

let arr = range(7, 42, 3)
console.log("arr", arr)

fisherYatesShuffle(arr)
console.log("arr shuffled in place", arr)
```

### @jackdbd/utils/logger

```js
import {logDebug, logError} from "@jackdbd/utils/logger"

logDebug("this is a string")
logDebug({
  message: "this is a JSON-structured log statement",
  answer: 42,
  someBoolean: true
})

logError("this is a string")
logError({
  message: "this is a JSON-structured log statement",
  answer: 42,
  someBoolean: true
})

```