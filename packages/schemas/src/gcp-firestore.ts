import Joi from 'joi'

const TAG = 'firestore'

export const client = Joi.any().description('Firestore client').tag(TAG)

export const collection = Joi.string()
  .min(1)
  .description('identifier for a Firestore collection')
  .tag(TAG)
  .example('users')

export const doc_id = Joi.string()
  .min(1)
  .description('identifier for a Firestore document')
  .tag(TAG)
  .example('5yDiQL7Hrtb4tQkr1hwl')

export const doc_result = Joi.object().keys({
  doc_id: doc_id.required(),
  data: Joi.object().required()
})

export const ref = Joi.any()
  .description('a Firestore Ref (e.g. query, collection reference)')
  .tag(TAG)
