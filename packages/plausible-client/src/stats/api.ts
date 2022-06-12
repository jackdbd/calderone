import Joi from 'joi'
import type {
  AggregateOptions,
  AggregateResponse,
  BreakdownOptions,
  BreakdownResponse,
  TimeseriesOptions,
  TimeseriesResponse
} from './interfaces.js'
import {
  aggregateConfig,
  aggregateOptions,
  breakdownConfig,
  breakdownOptions,
  timeseriesConfig,
  timeseriesOptions
} from './schemas.js'
import { INVALID } from '../common/constants.js'
import type { FetchClient } from '../fetch-clients/interfaces.js'

export const PREFIX_API_ERROR = '🌐 Plausible Stats API error:\n'
export const SUFFIX_API_ERROR =
  '\n📄 Check Stats API reference here: https://plausible.io/docs/stats-api'

export const apiError = (err: any): Error => {
  return new Error(`${PREFIX_API_ERROR}${err.message}${SUFFIX_API_ERROR}`)
}

const defaultAggregateOptions: Required<AggregateOptions> = {
  compare: '',
  filters: '',
  metrics: 'visitors',
  period: '30d'
}

interface Config<Res> {
  fetchClient: FetchClient<Res>
  siteId: string
}

export const INVALID_CONFIG_ERROR_PREFIX = `${INVALID} config`
export const INVALID_OPTIONS_ERROR_PREFIX = `${INVALID} options`

export const aggregate = async (
  config: Config<AggregateResponse>,
  options?: AggregateOptions
) => {
  Joi.assert(config, aggregateConfig, INVALID_CONFIG_ERROR_PREFIX)
  Joi.assert(options, aggregateOptions, INVALID_OPTIONS_ERROR_PREFIX)

  const { fetchClient, siteId } = config

  const metrics = options?.metrics || defaultAggregateOptions.metrics

  const period = options?.period || defaultAggregateOptions.period

  const params = [`metrics=${metrics}`, `period=${period}`, `site_id=${siteId}`]

  // I am not sure whether Plausible `compare` has a default value or not
  if (options?.compare && options.compare !== '') {
    params.push(`compare=${options.compare}`)
  }

  // I am not sure whether Plausible `filters` has a default value or not
  if (options?.filters && options.filters !== '') {
    params.push(`filters=${options.filters}`)
  }

  const endpoint = 'https://plausible.io/api/v1/stats/aggregate'
  const qs = params.join('&')
  const url = `${endpoint}?${qs}`

  try {
    const response = await fetchClient(url)
    return response.results
  } catch (err: any) {
    throw apiError(err)
  }
}

const defaultBreakdownOptions: Required<BreakdownOptions> = {
  filters: '',
  limit: 100,
  metrics: 'visitors',
  page: 1,
  period: '30d',
  property: 'event:page'
}

export const breakdown = async (
  config: Config<BreakdownResponse>,
  options?: BreakdownOptions
) => {
  Joi.assert(config, breakdownConfig, INVALID_CONFIG_ERROR_PREFIX)
  Joi.assert(options, breakdownOptions, INVALID_OPTIONS_ERROR_PREFIX)

  const { fetchClient, siteId } = config

  const limit = options?.limit || defaultBreakdownOptions.limit

  const metrics = options?.metrics || defaultBreakdownOptions.metrics

  const page = options?.page || defaultBreakdownOptions.page

  const period = options?.period || defaultBreakdownOptions.period

  const params = [
    `limit=${limit}`,
    `metrics=${metrics}`,
    `page=${page}`,
    `period=${period}`,
    `property=event:page`,
    `site_id=${siteId}`
  ]

  // I am not sure whether Plausible `filters` has a default value or not
  if (options?.filters && options.filters !== '') {
    params.push(`filters=${options.filters}`)
  }

  const endpoint = 'https://plausible.io/api/v1/stats/breakdown'
  const qs = params.join('&')
  const url = `${endpoint}?${qs}`

  try {
    const response = await fetchClient(url)
    return response.results
  } catch (err: any) {
    throw apiError(err)
  }
}

const defaultTimeseriesOptions: Required<TimeseriesOptions> = {
  filters: '',
  // Valid options are date (always) and month (when specified period is longer
  // than one calendar month). Defaults to month for 6mo and 12mo, otherwise
  // falls back to date.
  interval: 'date',
  metrics: 'visitors',
  period: '30d'
}

export const timeseries = async (
  config: Config<TimeseriesResponse>,
  options?: TimeseriesOptions
) => {
  Joi.assert(config, timeseriesConfig, INVALID_CONFIG_ERROR_PREFIX)
  Joi.assert(options, timeseriesOptions, INVALID_OPTIONS_ERROR_PREFIX)

  const { fetchClient, siteId } = config

  const interval = options?.interval || defaultTimeseriesOptions.interval

  const metrics = options?.metrics || defaultTimeseriesOptions.metrics

  const period = options?.period || defaultTimeseriesOptions.period

  const params = [
    `interval=${interval}`,
    `metrics=${metrics}`,
    `period=${period}`,
    `site_id=${siteId}`
  ]

  // I am not sure whether Plausible `filters` has a default value or not
  if (options?.filters && options.filters !== '') {
    params.push(`filters=${options.filters}`)
  }

  const endpoint = 'https://plausible.io/api/v1/stats/timeseries'
  const qs = params.join('&')
  const url = `${endpoint}?${qs}`

  try {
    const response = await fetchClient(url)
    return response.results
  } catch (err: any) {
    throw apiError(err)
  }
}

// TODO: export common queries like: topPages (e.g. in 6 months), trafficFromSource (e.g. Google)
// https://plausible.io/docs/stats-api#top-pages
// https://plausible.io/docs/stats-api#monthly-traffic-from-google
