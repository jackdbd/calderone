import {
  PREFIX_API_ERROR,
  aggregate,
  breakdown,
  timeseries
} from '../../lib/stats/api.js'
import { validApiCredentials, makeFetchTestClient } from '../utils.mjs'

describe('aggregate', () => {
  it('returns some results from the Plausible API [network,success]', async () => {
    const { apiKey, siteId } = await validApiCredentials(process.env)
    const fetchClient = await makeFetchTestClient(apiKey)
    const config = { fetchClient, siteId }

    const results = await aggregate(config)

    expect(results).toBeDefined()
    expect(results).toHaveProperty('visitors')
  })
})

describe('breakdown', () => {
  it('throws when no config is provided [error]', async () => {
    expect(breakdown()).rejects.toThrow()
  })

  it('rethrows an error originated from the Plausible API [error,network]', async () => {
    const { apiKey } = await validApiCredentials(process.env)
    const fetchClient = await makeFetchTestClient(apiKey)
    const config = {
      fetchClient,
      siteId: 'not-a-site-associated-with-my-API-key.com'
    }

    expect(breakdown(config)).rejects.toThrowError(PREFIX_API_ERROR)
  })

  it('returns some results from the Plausible API [network,success]', async () => {
    const { apiKey, siteId } = await validApiCredentials(process.env)
    const fetchClient = await makeFetchTestClient(apiKey)
    const config = { fetchClient, siteId }

    const results = await breakdown(config)

    expect(results).toBeDefined()
    expect(results.length).toBeGreaterThan(0)
  })
})

describe('timeseries', () => {
  it('returns some results from the Plausible API [network,success]', async () => {
    const { apiKey, siteId } = await validApiCredentials(process.env)
    const fetchClient = await makeFetchTestClient(apiKey)
    const config = { fetchClient, siteId }

    const results = await timeseries(config)

    expect(results).toBeDefined()
    expect(results.length).toBeGreaterThan(0)
  })
})
