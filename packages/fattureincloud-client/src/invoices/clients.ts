import makeDebug from 'debug'
import type Bottleneck from 'bottleneck'
import type { Credentials } from '../interfaces.js'
import { rateLimitedClient as withRateLimit } from '../rate-limit.js'
import {
  createInvoice,
  deleteInvoice,
  listInvoices,
  listInvoicesAsyncGenerator,
  retrieveInvoice
} from './api.js'
import type { ListResponseBody } from './api.js'
import type {
  CreateRequestBody,
  DeleteRequestBody,
  ListOptions,
  RetrieveConfig,
  DettaglioFattura
} from './interfaces.js'
import type { BasicClient } from '../interfaces.js'

const debug = makeDebug('fattureincloud-client/invoices/client')

/**
 * @public
 */
export interface Client extends BasicClient {
  create: (config: CreateRequestBody) => Promise<{ id: string; token: string }>

  delete: (config: DeleteRequestBody) => Promise<{ id: string }>

  list: (options?: ListOptions) => Promise<ListResponseBody>

  listAsyncGenerator: (
    options?: ListOptions
  ) => AsyncGenerator<ListResponseBody>

  retrieve: (config: RetrieveConfig) => Promise<DettaglioFattura>
}

/**
 * A basic client for FattureinCloud invoices.
 *
 * @public
 */
export const basicClient = (credentials: Credentials): Client => {
  debug('make FattureInCloud invoices API client')

  return {
    create: (config) => createInvoice(credentials, config),

    delete: (config) => deleteInvoice(credentials, config),

    list: (options) => listInvoices(credentials, options),

    listAsyncGenerator: (options) =>
      listInvoicesAsyncGenerator(credentials, options),

    retrieve: (config) => retrieveInvoice(credentials, config)
  }
}

/**
 * A rate-limited client for FattureinCloud invoices.
 *
 * @public
 */
export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
): Client => {
  return withRateLimit(basicClient(credentials), options)
}
