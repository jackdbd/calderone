import Joi from 'joi'
import {
  fetchClient,
  filters,
  metrics,
  page,
  period,
  siteId
} from '../common/schemas.js'

export const aggregateConfig = Joi.object()
  .keys({
    fetchClient: fetchClient.required(),
    siteId: siteId.required()
  })
  .required()

// https://plausible.io/docs/stats-api#get-apiv1statsaggregate
export const aggregateOptions = Joi.object().keys({
  compare: Joi.string().valid('previous_period'),
  filters,
  metrics,
  period
})

export const breakdownConfig = Joi.object()
  .keys({
    fetchClient: fetchClient.required(),
    siteId: siteId.required()
  })
  .required()

// https://plausible.io/docs/stats-api#get-apiv1statsbreakdown
export const breakdownOptions = Joi.object().keys({
  limit: Joi.number().min(1).max(100),
  metrics,
  page,
  period,
  property: Joi.string().min(1)
})

export const timeseriesConfig = Joi.object()
  .keys({
    fetchClient: fetchClient.required(),
    siteId: siteId.required()
  })
  .required()

// https://plausible.io/docs/stats-api#get-apiv1statstimeseries
export const timeseriesOptions = Joi.object().keys({
  filters,
  interval: Joi.string().valid('date', 'month'),
  metrics,
  period
})
