# @jackdbd/plausible-client

[![npm version](https://badge.fury.io/js/@jackdbd%2Fplausible-client.svg)](https://badge.fury.io/js/@jackdbd%2Fplausible-client)
![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/@jackdbd%2Fplausible-client)

Unofficial API client for [Plausible.io](https://plausible.io/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
<details><summary>Table of Contents</summary>

- [Installation](#installation)
- [API](#api)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>

## Installation

```sh
npm install @jackdbd/plausible-client
```

## API

[API docs generated with TypeDoc](https://jackdbd.github.io/calderone/plausible-client/)

## Usage

```js
import { makeClient } from '@jackdbd/plausible-client'
import { makeClient as makeStatsClient } from '@jackdbd/plausible-client/stats'
import { makeEleventyFetch } from '@jackdbd/plausible-client/fetch-clients/eleventy-fetch'
import { breakdown } from '@jackdbd/plausible-client/stats/api'

const main = async () => {
  const apiKey = 'YOUR-API-KEY'
  const siteId = 'YOUR-SITE-ID (i.e. domain)'

  const credentials = { apiKey, siteId }

  // options for eleventy-fetch (the fetch client used by the default API client)
  // https://www.11ty.dev/docs/plugins/fetch/#options
  const options = {
    // cache of JSON responses from the Plausible API
    directory: '.cache-plausible-json-responses',
    duration: '5s',
    verbose: true
  }

  // client for all Plausible APIs
  const plausible = makeClient(credentials, options)
  const results = await plausible.stats.breakdown()
  console.log('results', results)

  // client just for the Plausible Stats API
  const stats = makeStatsClient(credentials, options)
  const sameResults = await stats.breakdown()
  console.log('sameResults', sameResults)

  // no client, just a fetch
  const fetchClient = makeEleventyFetch(apiKey, options)
  const sameResultsOnceMore = await breakdown({ fetchClient, siteId })
  console.log('sameResultsOnceMore', sameResultsOnceMore)
}

main()
```