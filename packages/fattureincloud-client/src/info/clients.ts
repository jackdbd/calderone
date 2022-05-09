import makeDebug from 'debug'
import type Bottleneck from 'bottleneck'
import type { Credentials } from '../interfaces.js'
import { rateLimitedClient as withRateLimit } from '../rate-limit.js'
import { account as infoAccount } from './api.js'
import type { AccountOptions } from './interfaces.js'

const debug = makeDebug('fattureincloud-client/info/client')

export const basicClient = (credentials: Credentials) => {
  debug('make FattureInCloud info API client')

  return {
    account: (options?: AccountOptions) => {
      return infoAccount(credentials, options)
    }
  }
}

export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
) => {
  return withRateLimit(basicClient(credentials), options)
}
