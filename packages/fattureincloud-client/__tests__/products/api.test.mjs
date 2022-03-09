import { list, retrieve } from '../../lib/products/api.js'
import { credentials } from '../api-credentials.mjs'

describe('list', () => {
  it('throws the expected error when passed an invalid API Key or an invalid API UID', async () => {
    expect(
      list({
        api_key: 'invalid-api-key',
        api_uid: 'invalid-api-uid'
      })
    ).rejects.toThrowError("[401] Parametri 'api_key' e 'api_uid' non validi.")
  })

  it('returns the expected properties when passed a valid API Key and a valid API UID', async () => {
    const products = await list(credentials())

    expect(products).toHaveProperty('current_page')
    expect(products).toHaveProperty('total_pages')
    expect(products).toHaveProperty('results')
  })
})

describe('retrieve', () => {
  it('returns the expected product', async () => {
    const config = { id: '6113883' }

    const product = await retrieve(credentials(), config)

    expect(product.id).toBe(config.id)
  })
})
