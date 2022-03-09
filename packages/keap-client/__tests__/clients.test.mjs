import { basicKeapClient, storeKeapClient } from '../lib/clients.js'
// import { fsStore } from '../lib/tokens-stores/index.js'
// import { monorepoRoot } from '../lib/utils.js'
import { oAuthClientCredentials, oAuthTokens } from './credentials.mjs'

describe('basicKeapClient', () => {
  it('returns a Keap client that has the expected properties', () => {
    const keap = basicKeapClient({
      access_token: 'some-access-token',
      client_id: 'some-client-id',
      client_secret: 'some-client-secret',
      refresh_token: 'some-refresh-token'
    })

    expect(keap).toHaveProperty('contacts')
    expect(keap).toHaveProperty('tokens')
  })
})

describe.skip('storeKeapClient', () => {
  it('returns a Keap client that has the expected properties', async () => {
    const { client_id, client_secret } = oAuthClientCredentials()

    // const filepath = path.join(monorepoRoot(), 'secrets', 'keap.json')
    // const store = fsStore(filepath)
    // const { access_token, refresh_token } = await store.retrieve()
    const { access_token, refresh_token } = oAuthTokens()

    const keap = storeKeapClient({
      access_token,
      client_id,
      client_secret,
      refresh_token,
      store
    })

    expect(keap).toHaveProperty('contacts')
    expect(keap).toHaveProperty('tokens')
  })
})
