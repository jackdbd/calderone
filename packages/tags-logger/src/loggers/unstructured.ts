import type { Debugger } from 'debug'
import { isEmptyObject } from '../checks.js'
import type { Statement } from '../schemas.js'
import { stmtMapper } from '../utils.js'
import { validatedStatement } from './shared.js'
import type { MakeLogConfig } from './shared.js'

interface MakeLogStatementConfig {
  debug: Debugger
  should_use_emoji_for_severity: boolean
}

const makeLogStatement = ({
  debug,
  should_use_emoji_for_severity
}: MakeLogStatementConfig) => {
  return function logStatement(stmt: Statement) {
    const { emoji, severity, tags } = stmtMapper(stmt)

    const prefix = should_use_emoji_for_severity
      ? `[${emoji} ${tags.join(',')}]`
      : `[${severity} ${tags.join(',')}]`

    const message = `${prefix} ${stmt.message}`

    const { message: _message, tags: _tags, ...rest } = stmt

    if (isEmptyObject(rest)) {
      debug(message)
    } else {
      debug(`${message} %O`, rest)
    }
  }
}

interface MakeDebugLogConfig extends MakeLogConfig {
  debug: Debugger
  should_use_emoji_for_severity: boolean
}

/**
 * Factory that returns a `log` function that will print a string + optional
 * data when called.
 *
 * @internal
 */
export const makeUnstructuredLog = ({
  debug,
  should_use_emoji_for_severity,
  should_validate_statement,
  schema
}: MakeDebugLogConfig) => {
  const logStatement = makeLogStatement({
    debug,
    should_use_emoji_for_severity
  })

  return function log<T extends Statement = Statement>(stmt: T) {
    if (should_validate_statement) {
      logStatement(validatedStatement({ schema, stmt }))
    } else {
      logStatement(stmt)
    }
  }
}
