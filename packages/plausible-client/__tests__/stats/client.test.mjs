import {
  makeClient,
  makeClientWithCache,
  INVALID_CLIENT_CONFIG_ERROR_PREFIX,
  INVALID_CLIENT_WITH_CACHE_CONFIG_ERROR_PREFIX
} from '../../lib/stats/clients.js'
import { validApiCredentials } from '../utils.mjs'

describe('client', () => {
  it('throws when config is not provided [error]', () => {
    expect(() => {
      makeClient()
    }).toThrowError(INVALID_CLIENT_CONFIG_ERROR_PREFIX)
  })

  it('has the expected properties [success]', async () => {
    const { apiKey, siteId } = await validApiCredentials(process.env)
    const config = { apiKey, siteId }

    const client = makeClient(config)

    expect(client).toHaveProperty('aggregate')
    expect(client).toHaveProperty('breakdown')
    expect(client).toHaveProperty('timeseries')
  })
})

describe('clientWithCache', () => {
  it('throws when config is not provided [error]', () => {
    expect(() => {
      makeClientWithCache()
    }).toThrowError(INVALID_CLIENT_WITH_CACHE_CONFIG_ERROR_PREFIX)
  })

  it('has the expected properties [success]', async () => {
    const { apiKey, siteId } = await validApiCredentials(process.env)
    const config = { apiKey, siteId }

    const clientWithCache = makeClientWithCache(config)

    expect(clientWithCache).toHaveProperty('aggregate')
    expect(clientWithCache).toHaveProperty('breakdown')
    expect(clientWithCache).toHaveProperty('timeseries')
  })
})
