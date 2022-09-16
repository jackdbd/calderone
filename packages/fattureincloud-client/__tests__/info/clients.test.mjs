import { basicClient } from '../../lib/info/clients.js'
import { credentials } from '../api-credentials.mjs'

describe('basicClient', () => {
  it('returns the expected properties', () => {
    const info = basicClient(credentials())

    expect(info).toHaveProperty('account')
  })
})
