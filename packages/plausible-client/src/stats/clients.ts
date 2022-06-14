import makeDebug from 'debug'
import Joi from 'joi'
import type { Options } from '@11ty/eleventy-fetch'
import { aggregate, breakdown, timeseries } from './api.js'
import { INVALID } from '../common/constants.js'
import type { Credentials } from '../common/interfaces.js'
import { credentials as credentialsSchema } from '../common/schemas.js'
import { makeEleventyFetch } from '../fetch-clients/eleventy-fetch.js'
import type { FetchClient } from '../fetch-clients/interfaces.js'
import { eleventyFetchOptions } from '../fetch-clients/schemas.js'
import type {
  AggregateResponse,
  BreakdownResponse,
  TimeseriesResponse
} from '../stats/interfaces.js'

const debug = makeDebug('plausible/stats/clients')

export const INVALID_CLIENT_CONFIG_ERROR_PREFIX = `${INVALID} client config`

export const makeClient = (credentials: Credentials, options?: Options) => {
  debug(`validate schema: credentials`)
  Joi.assert(credentials, credentialsSchema, INVALID_CLIENT_CONFIG_ERROR_PREFIX)
  debug(`validate schema: options`)
  Joi.assert(options, eleventyFetchOptions)

  const { apiKey, siteId } = credentials

  debug(`create fetch client`)
  const fetchClient = makeEleventyFetch(apiKey, options)

  debug(`create API client`)
  // partial application
  return {
    aggregate: aggregate.bind(null, {
      fetchClient: fetchClient as FetchClient<AggregateResponse>,
      siteId
    }),
    breakdown: breakdown.bind(null, {
      fetchClient: fetchClient as FetchClient<BreakdownResponse>,
      siteId
    }),
    timeseries: timeseries.bind(null, {
      fetchClient: fetchClient as FetchClient<TimeseriesResponse>,
      siteId
    })
  }
}
