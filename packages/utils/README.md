# @jackdbd/utils

Miscellaneous utility functions.

## Installation

```sh
npm install @jackdbd/utils
```

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