import makeDebug from 'debug'
import type Bottleneck from 'bottleneck'
import type { Credentials } from '../interfaces.js'
import { rateLimitedClient as withRateLimit } from '../rate-limit.js'
import {
  create as createProduct,
  deleteProduct,
  list as listProducts,
  listAsyncGenerator as listProductsAsyncGenerator,
  retrieve as retrieveProduct
} from './api.js'
import type { ListResponseBody } from './api.js'
import type {
  Product,
  CreateRequestBody,
  ListOptions,
  DeleteRequestBody,
  RetrieveConfig
} from './interfaces.js'
import type { BasicClient } from '../interfaces.js'

const debug = makeDebug('fattureincloud-client/products/client')

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

  retrieve: (config: RetrieveConfig) => Promise<Product>
}

/**
 * A basic client for FattureinCloud products.
 *
 * @public
 */
export const basicClient = (credentials: Credentials): Client => {
  debug('make FattureInCloud products API client')

  return {
    create: (config) => createProduct(credentials, config),

    delete: (config) => deleteProduct(credentials, config),

    list: (options) => listProducts(credentials, options),

    listAsyncGenerator: (options) =>
      listProductsAsyncGenerator(credentials, options),

    retrieve: (config) => retrieveProduct(credentials, config)
  }
}

/**
 * A rate-limited client for FattureinCloud products.
 *
 * @public
 */
export const rateLimitedClient = (
  credentials: Credentials,
  options?: Bottleneck.ConstructorOptions
): Client => {
  return withRateLimit(basicClient(credentials), options)
}
