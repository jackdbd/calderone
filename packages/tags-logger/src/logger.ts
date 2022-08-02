import makeDebug from 'debug'
import type Joi from 'joi'
import {
  isCloudRunJob,
  isCloudRunService,
  isOnCloudFunctions
} from '@jackdbd/checks/environment'
import { isNamespaceInEnvVarDEBUG } from './checks.js'
import { default_statement_schema } from './schemas.js'
import type { Statement } from './schemas.js'
import { ERROR_MESSAGE } from './constants.js'
import { makeDebugLog } from './loggers/debug.js'
import { makeJSONLog } from './loggers/json.js'

/**
 * Options for the logger.
 *
 * @public
 */
export interface Options {
  /**
   * The namespace for the debug logger. This option has no effect on the JSON
   * logger.
   *
   * @defaultValue `'app'`
   */
  namespace?: string

  /**
   * Whether the debug logger should log a warning when the `namespace` string
   * is not included in the `DEBUG` environment variable. This option has no
   * effect on the JSON logger.
   *
   * @defaultValue `true`
   */
  should_log_warning_if_namespace_not_in_DEBUG?: boolean

  /**
   * Whether the debug logger should throw an error when the `namespace` string
   * is not included in the `DEBUG` environment variable. This option has no
   * effect on the JSON logger.
   *
   * @defaultValue `false`
   */
  should_throw_if_namespace_not_in_DEBUG?: boolean

  /**
   * Whether the JSON logger should be used, instead of the debug logger.
   *
   * @defaultValue `true` if on Google Cloud, otherwise `false`
   */
  should_use_json_logger?: boolean

  /**
   * Whether each log statement should be validated against a Joi schema.
   *
   * @defaultValue `true`
   */
  should_validate_log_statements?: boolean

  /**
   * The Joi schema used to validate each log statement.
   * This option has effect only when `should_validate_log_statements` is set to
   * `true`.
   *
   * @defaultValue  {@link default_statement_schema}
   */
  statement_schema?: Joi.ObjectSchema<Statement>
}

const DEFAULT: Required<Options> = {
  namespace: 'app',
  should_log_warning_if_namespace_not_in_DEBUG: true,
  should_throw_if_namespace_not_in_DEBUG: false,
  should_use_json_logger:
    isCloudRunJob(process.env) ||
    isCloudRunService(process.env) ||
    isOnCloudFunctions(process.env),
  should_validate_log_statements: true,
  statement_schema: default_statement_schema
}

/**
 * Creates a logger with optional schema validation for each log statement, and
 * that will either log strings + optional data, or JSON.
 *
 * Each log statement you pass to the `log` function returned to this logger
 * should have (and **must** have if you validate the log statements) a
 * `message` and a `tags` array.
 *
 * This logger was inspired by how logging is implemented in Hapi.js.
 *
 * @see [Logging - Hapi Tutorials](https://hapi.dev/tutorials/logging/)
 *
 * @public
 */
export const makeLogger = (options = {} as Options) => {
  const config = {} as Required<Options>
  Object.assign(config, DEFAULT, options)

  const {
    namespace,
    should_log_warning_if_namespace_not_in_DEBUG,
    should_throw_if_namespace_not_in_DEBUG,
    should_use_json_logger,
    should_validate_log_statements,
    statement_schema
  } = config

  if (should_use_json_logger) {
    return makeJSONLog({
      should_validate_statement: should_validate_log_statements,
      statement_schema
    })
  } else {
    if (!process.env.DEBUG && !should_use_json_logger) {
      throw new Error(ERROR_MESSAGE.DEBUG_IS_NOT_SET)
    }

    if (!isNamespaceInEnvVarDEBUG(namespace)) {
      const summary = `"${namespace}" ${ERROR_MESSAGE.NAMESPACE_NOT_INCLUDED_IN_DEBUG}`

      const details = [
        `this logger will log nothing`,
        `DEBUG is set to ${process.env.DEBUG}`
      ]

      const message = `${summary}: ${details.join('; ')}`

      if (should_throw_if_namespace_not_in_DEBUG) {
        throw new Error(message)
      }

      if (should_log_warning_if_namespace_not_in_DEBUG) {
        console.warn(`⚠️ ${message}`)
      }
    }

    return makeDebugLog({
      debug: makeDebug(namespace),
      should_validate_statement: should_validate_log_statements,
      statement_schema
    })
  }
}
