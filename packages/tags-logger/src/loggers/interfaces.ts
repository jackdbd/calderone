import type Joi from 'joi'
import type { Statement } from '../schemas.js'

export interface MakeLogConfig {
  should_validate_statement: boolean
  statement_schema: Joi.ObjectSchema<Statement>
}
