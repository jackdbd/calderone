import type { Statement } from '../schemas.js'
import { stmtMapper } from '../utils.js'
import { validatedStatement } from './shared.js'
import type { MakeLogConfig } from './shared.js'

interface TagDict {
  [tag: string]: boolean
}

const tagReducer = (d: TagDict, tag: string) => {
  d[tag] = true
  return d
}

/**
 * Prints a structured log statement to stdout.
 *
 * @internal
 */
const logStatement = (stmt: Statement) => {
  const { severity, tags } = stmtMapper(stmt)

  const { message, tags: tag_array, ...rest } = stmt

  const tag_dict = tags.reduce(tagReducer, {})

  switch (severity) {
    case 'debug':
    case 'info':
    case 'notice':
    case 'warning':
    case 'error':
    case 'critical':
    case 'alert':
    case 'emergency': {
      console.log(
        JSON.stringify(
          Object.assign(
            { severity: severity.toUpperCase() },
            { message, tags, tag: tag_dict, ...rest }
          )
        )
      )
      break
    }
    default: {
      throw new Error(
        `NOT IMPLEMENTED: severity ${severity} is not logged by this logger`
      )
    }
  }
}

/**
 * Factory that returns a `log` function that will print a JSON string when
 * called (structured logging).
 *
 * @see [Structured Logging - Google Cloud Operations Suite](https://cloud.google.com/logging/docs/structured-logging)
 *
 * @internal
 */
export const makeStructuredLog = ({
  should_validate_statement,
  schema
}: MakeLogConfig) => {
  return function log<T extends Statement = Statement>(stmt: T) {
    if (should_validate_statement) {
      logStatement(validatedStatement({ schema, stmt }))
    } else {
      logStatement(stmt)
    }
  }
}
