import Joi from 'joi'
import { hasAtLeastOneSeverityTag } from './checks.js'
import { SEVERITY_TAG_VALUES, SEVERITY_TAG_LABEL } from './constants.js'

/**
 * Shape of each statement passed to the logger.
 *
 * @public
 */
export interface Statement {
  /**
   * One or more sentences that we are interesting in logging.
   */
  message: string

  /**
   * An array of tags this log statement is related to.
   * The tags array should contain a **single** word describing the severity
   * level (*e.g.* `'debug'`, `'info'`), and **at least** tag describing what
   * the log statement is related to.
   *
   * @example
   * ['debug', 'api', 'network']
   */
  tags: string[]
}

const message = Joi.string().min(1)

const severity_tag = Joi.string()
  .valid(...SEVERITY_TAG_VALUES)
  .label(SEVERITY_TAG_LABEL)

const tag = Joi.string().min(1)

const tags = Joi.array()
  .items(tag)
  .has(severity_tag)
  .unique()
  .unique(hasAtLeastOneSeverityTag)

/**
 * Default Joi schema to validate log statement against.
 *
 * @public
 *
 * @remarks Log statements are validated (only when the option
 * `should_validate_log_statements` is set to `true`.
 */
export const default_statement_schema = Joi.object<Statement>().keys({
  message: message.required(),
  tags: tags.required()
})
