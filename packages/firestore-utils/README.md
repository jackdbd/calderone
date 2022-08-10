# @jackdbd/firestore-utils

[![npm version](https://badge.fury.io/js/@jackdbd%2Ffirestore-utils.svg)](https://badge.fury.io/js/@jackdbd%2Ffirestore-utils)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Ffirestore-utils)

Utility functions to work with [Firestore](https://cloud.google.com/firestore).

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
npm install @jackdbd/firestore-utils
```

> ⚠️ **Warning:**
> 
> This library declares [@google-cloud/firestore](https://www.npmjs.com/package/@google-cloud/firestore) as peer dependency.

## Usage

You can import the top-level module:

```ts
import { Firestore } from '@google-cloud/firestore'
import {
  bulkCopy,
  bulkDelete,
  bulkMove,
  moveData,
  shuffleWithFisherYates,
  docResultsWithData
} from '@jackdbd/firestore-utils'

const firestore = new Firestore()
const collection_ref = firestore.collection('some-collection')

const result_copy = await bulkCopy({
  copied_by: 'someone',
  dest_collection: 'some-other-collection',
  query: collection_ref.where('some-field', '>=', 42)
})

const result_move = await bulkMove({
  moved_by: 'someone',
  dest_collection: 'some-other-collection',
  query: collection_ref.where('some-field', '>=', 42)
})

await shuffleWithFisherYates(collection_ref)

const result_delete = await bulkDelete({ query: collection_ref })
```

or a specific ES module:

```ts
import { bulkCopy } from '@jackdbd/firestore-utils/copy'

import { bulkDelete } from '@jackdbd/firestore-utils/delete'

import {
  bulkMove,
  moveData,
  shuffleWithFisherYates
} from '@jackdbd/firestore-utils/move'

import { docResultsWithData } from '@jackdbd/firestore-utils/retrieve'
```

## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/firestore-utils/)
