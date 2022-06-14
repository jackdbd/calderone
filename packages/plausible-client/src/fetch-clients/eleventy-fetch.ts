import makeDebug from 'debug'
import Joi from 'joi'
import EleventyFetch from '@11ty/eleventy-fetch'
import type { Options } from '@11ty/eleventy-fetch'
import { INVALID, INVALID_API_KEY_ERROR_PREFIX } from '../common/constants.js'
import { apiKey as apiKeySchema } from '../common/schemas.js'
import { eleventyFetchOptions } from './schemas.js'

const debug = makeDebug('plausible/fetch-clients/eleventy-fetch')

export const defaultOptions: Omit<Required<Options>, 'type'> = {
  directory: '.cache',
  duration: '.5m',
  fetchOptions: {},
  verbose: false
}

export const INVALID_ELEVENTY_FETCH_ERROR_PREFIX = `${INVALID} EleventyFetch options:`

export const makeEleventyFetch = (apiKey: string, options?: Options) => {
  Joi.assert(apiKey, apiKeySchema, INVALID_API_KEY_ERROR_PREFIX)
  Joi.assert(options, eleventyFetchOptions, INVALID_ELEVENTY_FETCH_ERROR_PREFIX)

  const directory = options?.directory || defaultOptions.directory
  const duration = options?.duration || defaultOptions.duration

  let verbose = defaultOptions.verbose
  if (options && options.verbose !== undefined) {
    verbose = options.verbose
  }

  const fetchOptions = options?.fetchOptions || defaultOptions.fetchOptions
  const headers: { [k: string]: string } = fetchOptions.headers || {}
  headers.Authorization = `Bearer ${apiKey}`
  fetchOptions.headers = headers

  return async function fetch<Res>(url: string) {
    debug(`fetch ${url}`)
    debug(`cache options %O`, { directory, duration })
    const { headers, ...safeFetchOptions } = fetchOptions
    debug(`fetch options %O`, safeFetchOptions)

    return await EleventyFetch<Res>(url, {
      directory,
      duration,
      fetchOptions,
      type: 'json',
      verbose
    })
  }
}
