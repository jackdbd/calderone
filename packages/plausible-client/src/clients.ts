import makeDebug from 'debug'
import Joi from 'joi'
import type { Options } from '@11ty/eleventy-fetch'
import { INVALID } from './common/constants.js'
import type { Credentials } from './common/interfaces.js'
import { credentials as credentialsSchema } from './common/schemas.js'
import { eleventyFetchOptions } from './fetch-clients/schemas.js'
import { makeClient as makeStatsClient } from './stats/index.js'

const debug = makeDebug('plausible/clients')

const INVALID_CLIENT_CONFIG_ERROR_PREFIX = `${INVALID} client config`

export const makeClient = (credentials: Credentials, options?: Options) => {
  debug(`validate schema: credentials`)
  Joi.assert(credentials, credentialsSchema, INVALID_CLIENT_CONFIG_ERROR_PREFIX)
  debug(`validate schema: options`)
  Joi.assert(options, eleventyFetchOptions)

  return { stats: makeStatsClient(credentials, options) }
}
