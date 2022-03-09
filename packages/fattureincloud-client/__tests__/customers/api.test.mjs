import { list, retrieve } from '../../lib/customers/api.js'
import { credentials } from '../api-credentials.mjs'

describe('list', () => {
  it('throws the expected error when passed an invalid API Key or an invalid API UID', async () => {
    expect(
      list({ api_key: 'invalid-api-key', api_uid: 'invalid-api-uid' })
    ).rejects.toThrowError("[401] Parametri 'api_key' e 'api_uid' non validi.")
  })

  it('returns the expected properties when passed a valid API Key and a valid API UID', async () => {
    const customers = await list(credentials())

    expect(customers).toHaveProperty('current_page')
    expect(customers).toHaveProperty('total_pages')
    expect(customers).toHaveProperty('results')
  })
})

describe('retrieve', () => {
  it('returns the expected customer', async () => {
    const config = { id: '7043930' }

    const customer = await retrieve(credentials(), config)

    expect(customer.id).toBe(config.id)
  })
})
