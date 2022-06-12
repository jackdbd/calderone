import { makeClientWithCache } from '@jackdbd/plausible-client'
// import { makeClient as makeStatsClient } from '@jackdbd/plausible-client/stats'
// import { makeEleventyFetch } from '@jackdbd/plausible-client/fetch-clients/eleventy-fetch'
// import { breakdown } from '@jackdbd/plausible-client/stats/api'
import { jsonSecret } from './utils.mjs'

const main = async () => {
  const { api_key: apiKey, site_id: siteId } = jsonSecret('plausible')

  const config = { apiKey, siteId }

  const cacheOptions = {
    // cache of JSON responses from the Plausible API
    directory: '.cache-plausible-json-responses',
    duration: '5s',
    verbose: true
  }

  const plausible = makeClientWithCache(config, {
    ...cacheOptions
  })

  const results = await plausible.stats.breakdown()
  console.log('results', results)

  //   const stats = makeStatsClient(config)
  //   const sameResults = await stats.breakdown()
  //   console.log('sameResults', sameResults)

  //   const fetchClient = makeEleventyFetch(apiKey)
  //   const sameResultsOnceMore = await breakdown({ fetchClient, siteId })
  //   console.log('sameResultsOnceMore', sameResultsOnceMore)
}

main()
