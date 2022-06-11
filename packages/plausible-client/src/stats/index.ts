import Joi from 'joi'
import EleventyFetch from '@11ty/eleventy-fetch'
import { apiError } from '../errors'
import type { Config, Options, StatsAPIResponse } from './interfaces'
import { configSchema, optionsSchema } from './schemas'

const defaultOptions: Required<Options> = {
  cacheDirectory: '.cache',
  cacheDuration: '5m',
  cacheVerbose: false,
  limit: 100,
  period: '30d'
}

export const topPages = async (config: Config, options?: Options) => {
  Joi.assert(config, configSchema)
  Joi.assert(options, optionsSchema)

  const { apiKey, siteId } = config

  const cacheDirectory =
    options?.cacheDirectory || defaultOptions.cacheDirectory

  const cacheDuration = options?.cacheDuration || defaultOptions.cacheDuration

  let cacheVerbose = defaultOptions.cacheVerbose
  if (options && options.cacheVerbose !== undefined) {
    cacheVerbose = options.cacheVerbose
  }

  const limit = options?.limit || defaultOptions.limit

  const period = options?.period || defaultOptions.period

  const params = [
    `limit=${limit}`,
    `period=${period}`,
    `property=event:page`,
    `site_id=${siteId}`
  ]

  const endpoint = 'https://plausible.io/api/v1/stats/breakdown'
  const qs = params.join('&')

  const url = `${endpoint}?${qs}`

  const eleventyFetchOptions = {
    directory: cacheDirectory,
    duration: cacheDuration,
    fetchOptions: {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    },
    type: 'json',
    verbose: cacheVerbose
  }

  try {
    const response = await EleventyFetch<StatsAPIResponse>(
      url,
      eleventyFetchOptions
    )
    return response.results
  } catch (err: any) {
    throw apiError(err)
  }
}
