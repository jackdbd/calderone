import makeDebug from 'debug'
import type { Store } from '../tokens-stores/interfaces.js'
import { retrieveRefreshedTokens } from './api.js'

const debug = makeDebug('keap-client/tokens/store-client')

export interface TokensClientConfig {
  client_id: string
  client_secret: string
  refresh_token: string
  store: Store
}

export interface PersistRefreshedTokensOptions {
  refresh_token?: string
}

/**
 * Create a client for the `/token` Keap API endpoint.
 *
 * https://developer.keap.com/getting-started-oauth-keys/
 */
export const tokensClient = (config: TokensClientConfig) => {
  debug(`create client for Keap OAuth tokens`)

  const { client_id, client_secret, store } = config

  /**
   * Retrieve fresh access/refresh tokens from the Keap OAuth server, then
   * persist them.
   */
  const persistRefreshedTokens = async (
    options: PersistRefreshedTokensOptions = {}
  ) => {
    const refresh_token = options.refresh_token || config.refresh_token

    const refreshed_tokens = await retrieveRefreshedTokens({
      client_id,
      client_secret,
      refresh_token
    })
    await store.persist(refreshed_tokens)
  }

  return {
    persistRefreshedTokens,
    // retrieve tokens that were previously persisted to a store
    tokens: store.retrieve
  }
}
