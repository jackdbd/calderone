import { basicContactsClient } from '../../lib/contacts/index.js'

describe('basicContactsClient', () => {
  it('has the expected properties', () => {
    const client = basicContactsClient({
      access_token: 'some-access-token'
    })

    expect(client).toHaveProperty('retrieve')
    expect(client).toHaveProperty('retrieveById')
    expect(client).toHaveProperty('retrieveByQueryString')
    expect(client).toHaveProperty('retrieveByEmail')
  })
})
