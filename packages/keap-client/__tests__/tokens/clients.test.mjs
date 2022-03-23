import { basicTokensClient, storeTokensClient } from '../../lib/tokens/index.js'
import { fsStore } from '../../lib/tokens-stores/index.js'
import { oAuthClientCredentials, oAuthTokens } from '../credentials.mjs'

describe('basicTokensClient', () => {
  it('has the expected properties', () => {
    const { client_id, client_secret } = oAuthClientCredentials()

    const client = basicTokensClient({
      client_id,
      client_secret,
      refresh_token: 'some-refresh-token'
    })

    expect(client).toHaveProperty('tokens')
    expect(client).not.toHaveProperty('persistRefreshedTokens')
  })
})

describe.skip('storeTokensClient', () => {
  it('has the expected properties', () => {
    const { client_id, client_secret } = oAuthClientCredentials()

    const client = storeTokensClient({
      client_id,
      client_secret,
      refresh_token: 'some-refresh-token',
      store: fsStore(filepath)
    })

    expect(client).toHaveProperty('tokens')
    expect(client).toHaveProperty('persistRefreshedTokens')
  })

  it('can retrieve tokens previously persisted to the filesystem', async () => {
    const { client_id, client_secret } = oAuthClientCredentials()
    const { refresh_token } = oAuthTokens()

    // const filepath = path.join(monorepoRoot(), 'secrets', 'keap.json')
    // const store = fsStore(filepath)
    // const { refresh_token } = await store.retrieve()

    const client = storeTokensClient({
      client_id,
      client_secret,
      refresh_token,
      store
    })

    const tokens = await client.tokens()

    expect(tokens).toHaveProperty('access_token')
    expect(tokens).toHaveProperty('refresh_token')
  })

  it('can refresh tokens and persist them to the filesystem', async () => {
    const { client_id, client_secret } = oAuthClientCredentials()
    const { refresh_token } = oAuthTokens()

    const client = storeTokensClient({
      client_id,
      client_secret,
      refresh_token,
      store
    })

    const tokens_before = await client.tokens()
    await client.persistRefreshedTokens()
    const tokens_after = await client.tokens()

    expect(tokens_before).toHaveProperty('access_token')
    expect(tokens_before).toHaveProperty('refresh_token')
    expect(tokens_after).toHaveProperty('access_token')
    expect(tokens_after).toHaveProperty('refresh_token')

    expect(tokens_after.access_token).not.toBe(tokens_before.access_token)
    expect(tokens_after.refresh_token).not.toBe(tokens_before.refresh_token)
  })
})
