# @jackdbd/sqlite-utils

Utility functions to work with SQLite.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/sqlite-utils
```

> ⚠️ **Warning:**
> 
> This library declares [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) as peer dependency.

## Usage

You can import the top-level module:

```ts
import {
  bulkInsert,
  foreignKeys,
  pragmaDict,
  tableInfo
} from '@jackdbd/sqlite-utils'
```

or a specific ES module:

```ts
import {
  foreignKeys,
  pragmaDict,
  tableInfo
} from '@jackdbd/sqlite-utils/pragmas'

import { bulkInsert } from '@jackdbd/sqlite-utils/transactions'
```

## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/sqlite-utils/)
