import { basicClient, rateLimitedClient } from '../../lib/products/clients.js'
import { credentials } from '../api-credentials.mjs'

describe('basicClient', () => {
  it('returns the expected properties', () => {
    const products = basicClient(credentials())

    expect(products).toHaveProperty('create')
    expect(products).toHaveProperty('delete')
    expect(products).toHaveProperty('list')
    expect(products).toHaveProperty('listAsyncGenerator')
    expect(products).toHaveProperty('retrieve')
  })
})

describe('rateLimitedClient', () => {
  it('returns the expected properties', () => {
    const products = rateLimitedClient(credentials())

    expect(products).toHaveProperty('create')
    expect(products).toHaveProperty('delete')
    expect(products).toHaveProperty('list')
    expect(products).toHaveProperty('listAsyncGenerator')
    expect(products).toHaveProperty('retrieve')
  })
})
