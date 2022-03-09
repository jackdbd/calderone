import { basicClient, rateLimitedClient } from '../../lib/invoices/clients.js'
import { credentials } from '../api-credentials.mjs'

describe('basicClient', () => {
  it('returns the expected properties', () => {
    const invoices = basicClient(credentials())

    expect(invoices).toHaveProperty('create')
    expect(invoices).toHaveProperty('delete')
    expect(invoices).toHaveProperty('list')
    expect(invoices).toHaveProperty('listAsyncGenerator')
    expect(invoices).toHaveProperty('retrieve')
  })
})

describe('rateLimitedClient', () => {
  it('returns the expected properties', () => {
    const invoices = rateLimitedClient(credentials())

    expect(invoices).toHaveProperty('create')
    expect(invoices).toHaveProperty('delete')
    expect(invoices).toHaveProperty('list')
    expect(invoices).toHaveProperty('listAsyncGenerator')
    expect(invoices).toHaveProperty('retrieve')
  })
})
