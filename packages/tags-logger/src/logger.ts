import makeDebug from 'debug'
import { ErrorMessage } from './constants.js'
import { makeStructuredLog } from './loggers/structured.js'
import { makeUnstructuredLog } from './loggers/unstructured.js'
import { options as options_schema, statement } from './schemas.js'

/**
 * Factory that returns a `log` function that will either print structured or
 * unstructured log statements, with optional schema validation for each log
 * statement in both cases.
 *
 * Each log statement you pass to the `log` function returned to this logger
 * should have (and **must** have if you validate the log statements) a
 * `message` and a `tags` array.
 *
 * Unstructured logging is delegated to the
 * [debug](https://github.com/debug-js/debug) library. For example, if you set
 * the environment variable `DEBUG` to `DEBUG=app/*,-app/foo`, the log function
 * will print everything matching `app/*`, except `app/foo`.
 *
 * @see [Logging - Hapi Tutorials](https://hapi.dev/tutorials/logging/)
 * @see [Structured Logging - Google Cloud Operations Suite](https://cloud.google.com/logging/docs/structured-logging)
 * @see [debug logger - GitHub](https://github.com/debug-js/debug)
 *
 * @public
 */
export const makeLog = (options?: any) => {
  const { error, value } = options_schema.validate(options, {
    allowUnknown: false,
    stripUnknown: false
  })

  if (error) {
    throw new Error(
      `${ErrorMessage.INVALID_CONFIGURATION_ERROR_PREFIX}: ${error.message}`
    )
  }

  const namespace = value.namespace

  // these flags have a default, so they should never be undefined
  const should_use_emoji_for_severity =
    value.should_use_emoji_for_severity as boolean

  const should_validate_log_statements =
    value.should_validate_log_statements as boolean

  if (namespace) {
    return makeUnstructuredLog({
      debug: makeDebug(namespace),
      should_use_emoji_for_severity,
      should_validate_statement: should_validate_log_statements,
      schema: statement
    })
  } else {
    return makeStructuredLog({
      should_validate_statement: should_validate_log_statements,
      schema: statement
    })
  }
}
