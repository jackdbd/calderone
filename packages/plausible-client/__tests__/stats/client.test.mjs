import {
  makeClient,
  INVALID_CLIENT_CONFIG_ERROR_PREFIX
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
