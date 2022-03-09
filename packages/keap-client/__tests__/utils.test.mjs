import { contactsClient } from '../lib/contacts/basic-client.js'
import { tokensClient } from '../lib/tokens/store-client.js'
import { fsStore } from '../lib/tokens-stores/fs.js'
import { wrapRefreshRetry } from '../lib/utils.js'

describe.skip('wrapRefreshRetry', () => {
  //
  const token = tokensClient({
    client_id: process.env.KEAP_CLIENT_ID,
    client_secret: process.env.KEAP_CLIENT_SECRET,
    refresh_token: 'TODO',
    store: fsStore('keap-tokens.json')
  })

  it('the wrapped client has the same properties of the original client', async () => {
    const contacts = contactsClient({
      access_token: 'invalid-or-expired-access-token'
    })

    const contacts_with_retry = wrapRefreshRetry({
      refresh: token.persistRefreshedTokens(),
      client: contacts
    })

    expect(contacts).toHaveProperty('retrieve')
    expect(contacts_with_retry).toHaveProperty('retrieve')

    expect(contacts).toHaveProperty('retrieveAsyncGenerator')
    expect(contacts_with_retry).toHaveProperty('retrieveAsyncGenerator')

    expect(contacts).toHaveProperty('retrieveById')
    expect(contacts_with_retry).toHaveProperty('retrieveById')

    expect(contacts).toHaveProperty('retrieveByQueryString')
    expect(contacts_with_retry).toHaveProperty('retrieveByQueryString')

    expect(contacts).toHaveProperty('retrieveByEmail')
    expect(contacts_with_retry).toHaveProperty('retrieveByEmail')

    // const existent_id = 133
    // const contact = await contacts_with_retry.getById(existent_id)
    // expect(contact.id).toBe(existent_id)
  })
})
