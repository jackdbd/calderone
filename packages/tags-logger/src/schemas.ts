import Joi from 'joi'
import { hasAtLeastOneSeverityTag } from './checks.js'
import { SEVERITY_TAG_VALUES, SEVERITY_TAG_LABEL } from './constants.js'

/**
 * Shape of each log statement.
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
   *
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

/**
 * Joi schema for the `tags` array of each log statement.
 *
 * @internal
 */
const tags = Joi.array()
  .items(tag)
  .has(severity_tag)
  .unique()
  .unique(hasAtLeastOneSeverityTag)

/**
 * Joi schema to validate each log statement against.
 *
 * @remarks
 * Log statements are validated only when the option
 * `should_validate_log_statements` is set to `true`.
 *
 * @public
 */
export const statement = Joi.object<Statement>().keys({
  message: message.required(),
  tags: tags.required()
})

/**
 * Options for the logger.
 *
 * @public
 */
export interface Options {
  /**
   * The namespace for the debug logger (unstructured logging).
   * This option has no effect when using structured logging.
   *
   * @defaultValue `undefined`
   */
  namespace?: string

  /**
   * Whether to use an emoji for the severity level (unstructured logging).
   * This option has no effect when using structured logging.
   *
   * @defaultValue `true`
   */
  should_use_emoji_for_severity?: boolean

  /**
   * Whether each log statement should be validated against a Joi schema.
   *
   * @defaultValue `true`
   */
  should_validate_log_statements?: boolean
}

const DEFAULT_OPTIONS: Options = {
  namespace: undefined,
  should_use_emoji_for_severity: true,
  should_validate_log_statements:
    process.env.NODE_ENV === 'production' ? false : true
}

export const options = Joi.object<Options>()
  .keys({
    namespace: Joi.string()
      .min(1)
      .description('namespace for the debug logger (unstructured logging)')
      .optional(),

    should_use_emoji_for_severity: Joi.boolean()
      .description(
        'whether to use an emoji for the severity level (unstructured logging)'
      )
      .optional()
      .default(DEFAULT_OPTIONS.should_use_emoji_for_severity),

    should_validate_log_statements: Joi.boolean()
      .description(
        'whether each log statement should be validated against a Joi schema'
      )
      .optional()
      .default(DEFAULT_OPTIONS.should_validate_log_statements)
  })
  .default(DEFAULT_OPTIONS)
