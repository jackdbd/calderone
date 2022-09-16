import makeDebug from 'debug'
import type Bottleneck from 'bottleneck'
import type { Credentials } from './interfaces.js'

import {
  basicClient as customersBasicClient,
  rateLimitedClient as customersRateLimitedClient
} from './customers/clients.js'
import type { Client as CustomersClient } from './customers/clients.js'

import {
  basicClient as infoBasicClient,
  rateLimitedClient as infoRateLimitedClient
} from './info/clients.js'
import type { Client as InfoClient } from './info/clients.js'

import {
  basicClient as invoicesBasicClient,
  rateLimitedClient as invoicesRateLimitedClient
} from './invoices/clients.js'
import type { Client as InvoicesClient } from './invoices/clients.js'

import {
  basicClient as productsBasicClient,
  rateLimitedClient as productsRateLimitedClient
} from './products/clients.js'
import type { Client as ProductsClient } from './products/clients.js'

const debug = makeDebug('fattureincloud-client/clients')

export interface Client {
  customers: CustomersClient
  info: InfoClient
  invoices: InvoicesClient
  products: ProductsClient
}

/**
 * A basic client for all endpoints of the FattureinCloud API.
 *
 * @remarks This client is not rate-limiting. If you are calling the
 * FattureinCloud API more than once, you might want to use the
 * rateLimitedClient instead.
 *
 * @public
 */
export const basicClient = (credentials: Credentials): Client => {
  debug('make FattureInCloud basic API client')

  return {
    customers: customersBasicClient(credentials),
    info: infoBasicClient(credentials),
    invoices: invoicesBasicClient(credentials),
    products: productsBasicClient(credentials)
  }
}

/**
 * A rate-limited client for all endpoints of the FattureinCloud API.
 *
 * @public
 */
export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
): Client => {
  debug('make FattureInCloud rate-limited API client')

  return {
    customers: customersRateLimitedClient(credentials, options),
    info: infoRateLimitedClient(credentials, options),
    invoices: invoicesRateLimitedClient(credentials, options),
    products: productsRateLimitedClient(credentials, options)
  }
}
