import Joi from 'joi'

const TAG = 'secret-manager'

export const client = Joi.any().description('Secret Manager client').tag(TAG)

export const secret_name = Joi.string()
  .min(1)
  .description('name of the secret on Secret Manager')
  .tag(TAG)
  .example('MY_SECRET')

// TODO: A Secret Manager version of a secret can be either a number, or 'latest'
export const secret_version = Joi.string()
  .min(1)
  .description('version of the secret on Secret Manager')
  .tag(TAG)
  .example('latest')
