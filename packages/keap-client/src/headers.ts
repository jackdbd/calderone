import makeDebug from 'debug'
import { client_id_not_set, client_secret_not_set } from './error.js'

const debug = makeDebug('keap-client/headers')

interface HeadersConfig {
  access_token: string
}

export const headers = ({ access_token }: HeadersConfig) => {
  debug(`create HTTP request headers`)
  return {
    Authorization: `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  }
}

interface AuthenticationHeaderConfig {
  // OAuth 2.0 client id
  client_id: string
  // OAuth 2.0 client secret
  client_secret: string
}

/**
 * Use the given OAuth 2.0 client id + client secret to generate a value for the
 * `Authorization` request header.
 *
 * The generated string has to be used in TWO places: both the Authorization
 * header AND the 'Header:Authorization' form field.
 *
 * See paragraph Refresh Request in the Infusionsoft documentation:
 * https://developer.infusionsoft.com/getting-started-oauth-keys/
 */
export const authorizationHeaderValue = ({
  client_id,
  client_secret
}: AuthenticationHeaderConfig) => {
  if (!client_id) {
    throw new Error(client_id_not_set)
  }

  if (!client_secret) {
    throw new Error(client_secret_not_set)
  }

  const secret = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
  return `Basic ${secret}`
}
