import Joi from 'joi'

const TAG = 'error-reporting'

export const client = Joi.any().description('Error Reporting client').tag(TAG)
