import Joi from 'joi'

const TAG = 'environment'

export const key = Joi.string()
  .min(1)
  .description(
    'A key from the Node.js execution environment, i.e. a key to lookup in process.env'
  )
  .tag(TAG)

export const NODE_ENV_EXAMPLES = ['development', 'test', 'production']
export const NODE_ENV_DEFAULT = ['development', 'test', 'production']

export const node_env_allowed_value = Joi.string()
  .min(1)
  .max(64)
  .description('Value allowed for process.env.NODE_ENV')
  .tag(TAG)
  .example(NODE_ENV_EXAMPLES[0])
  .example(NODE_ENV_EXAMPLES[1])
  .example(NODE_ENV_EXAMPLES[2])

export const node_env_allowed_values = Joi.array()
  .items(node_env_allowed_value)
  .min(1)
  .description('Values allowed for process.env.NODE_ENV')
  .tag(TAG)
  .example(NODE_ENV_EXAMPLES)
