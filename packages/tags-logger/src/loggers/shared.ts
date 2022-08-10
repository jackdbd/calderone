import type Joi from 'joi'
import { ErrorMessage } from '../constants.js'
import type { Statement } from '../schemas.js'

/**
 * Configuration for the factory function that returns the `log` function.
 *
 * @internal
 */
export interface MakeLogConfig {
  /**
   * Whether each log statement should be validated or not.
   */
  should_validate_statement: boolean

  /**
   * Joi schema to validate each log statement against.
   */
  schema: Joi.ObjectSchema<Statement>
}

interface ValidationConfig {
  schema: Joi.ObjectSchema<Statement>
  stmt: Statement
}

/**
 * Validates a log statement against a Joi schema, and throws if the statement
 * does not comply with the schema.
 *
 * @internal
 */
export const validatedStatement = ({ schema, stmt }: ValidationConfig) => {
  const { error, value } = schema.validate(stmt, {
    allowUnknown: true,
    stripUnknown: false
  })

  if (error) {
    const message = error.message
      ? `${ErrorMessage.LOG_STATEMENT_VALIDATION_ERROR_PREFIX}: ${error.message}`
      : `${ErrorMessage.LOG_STATEMENT_VALIDATION_ERROR_PREFIX}: error does not have a message`

    throw new Error(message)
  }

  return value
}
