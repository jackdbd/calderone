import Joi from 'joi'

const TAG = 'cloud-tasks'

export const client = Joi.any().description('Cloud Tasks client').tag(TAG)

export const queue_id = Joi.string()
  .min(1)
  .description('identifier for a Cloud Tasks queue')
  .tag(TAG)

export const queue_location_id = Joi.string()
  .min(1)
  .description('location of a Cloud Tasks queue')
  .tag(TAG)
