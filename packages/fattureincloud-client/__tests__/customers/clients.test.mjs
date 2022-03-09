import { basicClient, rateLimitedClient } from '../../lib/customers/clients.js'
import { credentials } from '../api-credentials.mjs'

describe('basicClient', () => {
  it('returns the expected properties', () => {
    const customers = basicClient(credentials())

    expect(customers).toHaveProperty('create')
    expect(customers).toHaveProperty('delete')
    expect(customers).toHaveProperty('list')
    expect(customers).toHaveProperty('listAsyncGenerator')
    expect(customers).toHaveProperty('retrieve')
  })
})

describe('rateLimitedClient', () => {
  it('returns the expected properties', () => {
    const customers = rateLimitedClient(credentials())

    expect(customers).toHaveProperty('create')
    expect(customers).toHaveProperty('delete')
    expect(customers).toHaveProperty('list')
    expect(customers).toHaveProperty('listAsyncGenerator')
    expect(customers).toHaveProperty('retrieve')
  })
})
