import { authorizationHeaderValue } from '../lib/headers.js'
import { client_id_not_set, client_secret_not_set } from '../lib/error.js'

describe('authorizationHeaderValue', () => {
  it('throws the expected error when client_id is not set', () => {
    expect(() => {
      authorizationHeaderValue({
        client_id: '',
        client_secret: ''
      })
    }).toThrow(client_id_not_set)
  })

  it('throws the expected error when client_secret is not set', () => {
    expect(() => {
      authorizationHeaderValue({
        client_id: 'some-client-id',
        client_secret: ''
      })
    }).toThrow(client_secret_not_set)
  })

  it('throws the expected error when refresh_token is not set', () => {
    const authorization = authorizationHeaderValue({
      client_id: 'some-client-id',
      client_secret: 'some-client-secret'
    })
    expect(authorization.includes('Basic')).toBeTruthy()
  })
})
