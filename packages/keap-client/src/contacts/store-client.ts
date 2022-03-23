import makeDebug from 'debug'
import type { Store } from '../tokens-stores/interfaces.js'
import {
  retrieveContacts,
  retrieveContactById,
  retrieveContactsByQueryString,
  retrieveContactsByEmail,
  retrieveContactsAsyncGenerator
} from './api.js'
import type { RetrieveContactOptions, RetrieveContactsOptions } from './api.js'

const debug = makeDebug('keap-client/contacts/store-client')

interface ContactsClientConfig {
  access_token: string
  store: Store
}

const accessToken = async (
  options: { access_token?: string },
  store: Store
) => {
  if (options.access_token) {
    return options.access_token
  } else {
    const tokens = await store.retrieve()
    return tokens.access_token
  }
}

/**
 * Create a client for the `/contacts` Keap API endpoint.
 *
 * https://developer.infusionsoft.com/docs/rest/#!/Contact/listContactsUsingGET_2
 */
export const contactsClient = (config: ContactsClientConfig) => {
  debug(`create client for Keap contacts`)

  const retrieve = async (options: RetrieveContactsOptions) => {
    const access_token = await accessToken(options, config.store)
    return retrieveContacts({ ...options, access_token })
  }

  const retrieveById = async (id: number, options: RetrieveContactOptions) => {
    const access_token = await accessToken(options, config.store)
    return retrieveContactById(id, { ...options, access_token })
  }

  const retrieveByQueryString = async (
    qs: string,
    options: RetrieveContactsOptions
  ) => {
    const access_token = await accessToken(options, config.store)
    return retrieveContactsByQueryString(qs, { ...options, access_token })
  }

  const retrieveByEmail = async (
    email: string,
    options: RetrieveContactsOptions
  ) => {
    const access_token = await accessToken(options, config.store)
    return retrieveContactsByEmail(email, { ...options, access_token })
  }

  const retrieveAsyncGenerator = async (options: RetrieveContactsOptions) => {
    const access_token = await accessToken(options, config.store)
    return retrieveContactsAsyncGenerator({ ...options, access_token })
  }

  return {
    retrieve,
    retrieveAsyncGenerator,
    retrieveById,
    retrieveByQueryString,
    retrieveByEmail
  }
}
