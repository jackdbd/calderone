import Joi from 'joi'
import type { Options } from '@11ty/eleventy-fetch'
import { INVALID } from './common/constants.js'
import type { Config } from './common/interfaces.js'
import { clientConfig, clientWithCacheConfig } from './common/schemas.js'
import { INVALID_ELEVENTY_FETCH_ERROR_PREFIX } from './fetch-clients/eleventy-fetch.js'
import { eleventyFetchOptions } from './fetch-clients/schemas.js'
import {
  makeClient as makeStatsClient,
  makeClientWithCache as makeStatsClientWithCache
} from './stats/index.js'

const INVALID_CLIENT_CONFIG = `${INVALID} client config`

export const makeClient = (config: Config) => {
  Joi.assert(config, clientConfig, INVALID_CLIENT_CONFIG)
  return { stats: makeStatsClient(config) }
}

export const makeClientWithCache = (config: Config, options?: Options) => {
  Joi.assert(config, clientWithCacheConfig, INVALID_CLIENT_CONFIG)
  Joi.assert(options, eleventyFetchOptions, INVALID_ELEVENTY_FETCH_ERROR_PREFIX)

  return { stats: makeStatsClientWithCache(config, options) }
}
