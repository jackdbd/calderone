import {
  retrieveContacts,
  retrieveContactById
} from '../../lib/contacts/api.js'
import {
  access_token_not_set,
  invalidAccessTokenErrorMessage,
  notFoundErrorMessage
} from '../../lib/error.js'
import { oAuthTokens } from '../credentials.mjs'

describe('retrieveContact', () => {
  it('throws the expected error when the OAuth 2.0 access token is not set', async () => {
    await expect(retrieveContacts()).rejects.toThrow(access_token_not_set)
  })

  it('throws the expected error when the OAuth 2.0 access token is invalid', async () => {
    await expect(
      retrieveContacts({ access_token: 'some-invalid-token' })
    ).rejects.toThrow(invalidAccessTokenErrorMessage('contacts'))
  })

  it.skip('returns paginated contacts when the OAuth 2.0 access token is valid', async () => {
    // TODO: get this token from Secret Manager or GitHub. Refresh it before running this test
    const { access_token } = oAuthTokens()

    const paginated_contacts = await retrieveContacts({ access_token })

    expect(paginated_contacts).toHaveProperty('count')
    expect(paginated_contacts).toHaveProperty('next')
    expect(paginated_contacts).toHaveProperty('previous')
  })

  it.skip('returns only 10 contacts when pagination.limit is set to 10', async () => {
    const { access_token } = oAuthTokens()

    const paginated_contacts = await retrieveContacts({
      access_token,
      pagination: { limit: 10 }
    })

    expect(paginated_contacts.data).toHaveLength(10)
  })
})

describe('retrieveContactById', () => {
  it('throws the expected error when the OAuth 2.0 access token is not set', async () => {
    const id = 1
    await expect(retrieveContactById(id)).rejects.toThrow(access_token_not_set)
  })

  it('throws the expected error when the OAuth 2.0 access token is invalid', async () => {
    const id = 1
    await expect(
      retrieveContactById(id, { access_token: 'some-invalid-token' })
    ).rejects.toThrow(invalidAccessTokenErrorMessage(`contact ID ${id}`))
  })

  it.skip('throws the expected error when the given `id` is not associated with a contact', async () => {
    const { access_token } = oAuthTokens()
    const id = 1

    await expect(retrieveContactById(id, { access_token })).rejects.toThrow(
      notFoundErrorMessage(`contact with ID ${id}`)
    )
  })

  it.skip('returns the expected contact when the given `id` is associated with a contact', async () => {
    const { access_token } = oAuthTokens()
    const id = 17552

    const res_body = await retrieveContactById(id, { access_token })

    expect(res_body).toBeDefined()
    expect(res_body.id).toBe(id)
  })
})
