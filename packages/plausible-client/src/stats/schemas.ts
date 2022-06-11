import Joi from 'joi'

export const configSchema = Joi.object().keys({
  // API key of your Plausible.io account. You can find it in your user settings
  // page.
  // https://plausible.io/settings
  apiKey: Joi.string().min(1).max(100).required(),

  // the `siteId` of a Plausible.io site is just the naked domain
  // https://webmasters.stackexchange.com/questions/16996/maximum-domain-name-length
  siteId: Joi.string().min(4).max(253).required()
})

export const optionsSchema = Joi.object().keys({
  // https://www.11ty.dev/docs/plugins/fetch/#cache-directory
  cacheDirectory: Joi.string().min(1),

  // https://www.11ty.dev/docs/plugins/fetch/#change-the-cache-duration
  cacheDuration: Joi.string().min(2),

  // https://www.11ty.dev/docs/plugins/fetch/#verbose-output
  cacheVerbose: Joi.boolean(),

  // https://plausible.io/docs/stats-api#parameters-3
  limit: Joi.number().min(1).max(100),

  // https://plausible.io/docs/stats-api#time-periods
  period: Joi.string()

  //   visitorsThreshold: Joi.number().min(1)
})
