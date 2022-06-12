import Joi from 'joi'
import type { Options } from '@11ty/eleventy-fetch'
import { aggregate, breakdown, timeseries } from './api.js'
import { INVALID } from '../common/constants.js'
import {
  makeEleventyFetch,
  INVALID_ELEVENTY_FETCH_ERROR_PREFIX
} from '../fetch-clients/eleventy-fetch.js'
import type { Config } from '../common/interfaces.js'
import { eleventyFetchOptions } from '../fetch-clients/schemas.js'
import { clientConfig, clientWithCacheConfig } from '../common/schemas.js'

export const INVALID_CLIENT_CONFIG_ERROR_PREFIX = `${INVALID} client config`

export const makeClient = (config: Config) => {
  Joi.assert(config, clientConfig, INVALID_CLIENT_CONFIG_ERROR_PREFIX)
  const { apiKey, siteId } = config

  // TODO: do not use a cache with this client, use something like phin
  // https://github.com/ethanent/phin
  const fetchClient = makeEleventyFetch(apiKey)

  // partial application
  return {
    aggregate: aggregate.bind(null, { fetchClient, siteId }),
    breakdown: breakdown.bind(null, { fetchClient, siteId }),
    timeseries: timeseries.bind(null, { fetchClient, siteId })
  }
}

export const INVALID_CLIENT_WITH_CACHE_CONFIG_ERROR_PREFIX = `${INVALID} clientWithCache config`

export const makeClientWithCache = (config: Config, options?: Options) => {
  Joi.assert(
    config,
    clientWithCacheConfig,
    INVALID_CLIENT_WITH_CACHE_CONFIG_ERROR_PREFIX
  )

  Joi.assert(options, eleventyFetchOptions, INVALID_ELEVENTY_FETCH_ERROR_PREFIX)

  const { apiKey, siteId } = config

  const fetchClient = makeEleventyFetch(apiKey, options)

  // partial application
  return {
    aggregate: aggregate.bind(null, { fetchClient, siteId }),
    breakdown: breakdown.bind(null, { fetchClient, siteId }),
    timeseries: timeseries.bind(null, { fetchClient, siteId })
  }
}
