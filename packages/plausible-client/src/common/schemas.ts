import Joi from 'joi'

// API key of your Plausible.io account.
// You can find it in your user settings page.
// https://plausible.io/settings
export const apiKey = Joi.string().min(1).max(100)

export const fetchClient = Joi.function()

// https://plausible.io/docs/stats-api#filtering
export const filters = Joi.string()

// https://plausible.io/docs/stats-api#metrics
export const metrics = Joi.string()

// the first paginated response from the Plausible API has page=1, not page=0
export const page = Joi.number().min(1)

// https://plausible.io/docs/stats-api#time-periods
export const period = Joi.string()

// the `siteId` of a Plausible.io site is just the naked domain
// https://webmasters.stackexchange.com/questions/16996/maximum-domain-name-length
export const siteId = Joi.string().min(4).max(253)

export const credentials = Joi.object()
  .keys({
    apiKey: apiKey.required(),
    siteId: siteId.required()
  })
  .required()
