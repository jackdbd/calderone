/**
 * Entry point for the documentation of plausible-client.
 *
 * @packageDocumentation
 */
export type { FetchOptions, Options } from '@11ty/eleventy-fetch'
export { makeClient } from './clients.js'

export type { Credentials } from './common/interfaces.js'

export type {
  AggregateOptions,
  AggregateResponse,
  BreakdownOptions,
  BreakdownResponse,
  BreakdownResult,
  TimeseriesOptions,
  TimeseriesResponse,
  TimeseriesResult
} from './stats/interfaces.js'
