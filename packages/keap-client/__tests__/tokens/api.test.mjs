// import fs from 'node:fs'
import { retrieveRefreshedTokens } from '../../lib/tokens/api.js'
import {
  client_id_not_set,
  client_secret_not_set,
  refresh_token_not_set
} from '../../lib/error.js'
import { oAuthClientCredentials, oAuthTokens } from '../credentials.mjs'

describe('retrieveRefreshedTokens', () => {
  it('throws the expected error when client_id is not set', async () => {
    await expect(
      retrieveRefreshedTokens({
        client_id: '',
        client_secret: '',
        refresh_token: ''
      })
    ).rejects.toThrow(client_id_not_set)
  })

  it('throws the expected error when client_secret is not set', async () => {
    await expect(
      retrieveRefreshedTokens({
        client_id: 'some-client-id',
        client_secret: '',
        refresh_token: ''
      })
    ).rejects.toThrow(client_secret_not_set)
  })

  it('throws the expected error when refresh_token is not set', async () => {
    await expect(
      retrieveRefreshedTokens({
        client_id: 'some-client-id',
        client_secret: 'some-client-secret',
        refresh_token: ''
      })
    ).rejects.toThrow(refresh_token_not_set)
  })

  it('throws the expected error when client_id is invalid', async () => {
    await expect(
      retrieveRefreshedTokens({
        client_id: 'invalid-client-id',
        client_secret: 'some-client-secret',
        refresh_token: 'some-refresh-token'
      })
    ).rejects.toThrow('Invalid client identifier')
  })

  it.skip('returns a new access_token and a new refresh token when the OAuth 2.0 credentials are valid', async () => {
    const { refresh_token } = oAuthTokens()
    const { client_id, client_secret } = oAuthClientCredentials()

    const tokens = await retrieveRefreshedTokens({
      client_id,
      client_secret,
      refresh_token
    })

    expect(tokens).toHaveProperty('access_token')
    expect(tokens).toHaveProperty('refresh_token')

    // fs.writeFileSync(json_path, JSON.stringify(tokens, null, 2))
  })
})
