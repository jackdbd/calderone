import makeDebug from 'debug'
import type Bottleneck from 'bottleneck'
import type { Credentials } from '../interfaces.js'
import { rateLimitedClient as withRateLimit } from '../rate-limit.js'
import {
  create as createCustomer,
  deleteCustomer,
  list as listCustomers,
  listAsyncGenerator as listCustomersAsyncGenerator,
  retrieve as retrieveCustomer,
  update as updateCustomer
} from './api.js'
import type { ListResponseBody } from './api.js'
import type {
  Customer,
  CreateRequestBody,
  ListOptions,
  DeleteRequestBody,
  RetrieveConfig,
  UpdateRequestBody
} from './interfaces.js'
import type { BasicClient } from '../interfaces.js'

const debug = makeDebug('fattureincloud-client/customers/client')

/**
 * @public
 */
export interface Client extends BasicClient {
  create: (config: CreateRequestBody) => Promise<{ id: string }>

  delete: (config: DeleteRequestBody) => Promise<{ id: string }>

  list: (options?: ListOptions) => Promise<ListResponseBody>

  listAsyncGenerator: (
    options?: ListOptions
  ) => AsyncGenerator<ListResponseBody>

  retrieve: (config: RetrieveConfig) => Promise<Customer>

  update: (
    config: UpdateRequestBody
  ) => Promise<{ id: string; campi: string[] }>
}

/**
 * A basic client for FattureinCloud customers.
 *
 * @public
 */
export const basicClient = (credentials: Credentials): Client => {
  debug('make FattureInCloud customers API client')

  return {
    create: (config) => createCustomer(credentials, config),

    delete: (config) => deleteCustomer(credentials, config),

    list: (options) => listCustomers(credentials, options),

    listAsyncGenerator: (options) =>
      listCustomersAsyncGenerator(credentials, options),

    retrieve: (config) => retrieveCustomer(credentials, config),

    update: (config) => updateCustomer(credentials, config)
  }
}

/**
 * A rate-limited client for FattureinCloud customers.
 *
 * @public
 */
export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
): Client => {
  return withRateLimit(basicClient(credentials), options)
}
