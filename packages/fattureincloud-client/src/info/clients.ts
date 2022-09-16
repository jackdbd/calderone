import makeDebug from 'debug'
import type Bottleneck from 'bottleneck'
import type { Credentials } from '../interfaces.js'
import { rateLimitedClient as withRateLimit } from '../rate-limit.js'
import { account as infoAccount } from './api.js'
import type { AccountResponseBody } from './api.js'
import type { AccountOptions } from './interfaces.js'
import type { BasicClient } from '../interfaces.js'

const debug = makeDebug('fattureincloud-client/info/client')

/**
 * @public
 */
export interface Client extends BasicClient {
  account: (options?: AccountOptions) => Promise<AccountResponseBody>
}

/**
 * A basic client for FattureinCloud info.
 *
 * @public
 */
export const basicClient = (credentials: Credentials): Client => {
  debug('make FattureInCloud info API client')

  return {
    account: (options) => infoAccount(credentials, options)
  }
}

/**
 * A rate-limited client for FattureinCloud info.
 *
 * @public
 */
export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
) => {
  return withRateLimit(basicClient(credentials), options)
}
