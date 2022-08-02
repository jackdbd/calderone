import type { Debugger } from 'debug'
import { isEmptyObject, shouldLog } from '../checks.js'
import { ERROR_MESSAGE } from '../constants.js'
import type { Statement } from '../schemas.js'
import { stmtMapper } from '../utils.js'
import type { MakeLogConfig } from './interfaces.js'

interface LogStatementConfig {
  debug: Debugger
  stmt: Statement
}

const logStatement = ({ debug, stmt }: LogStatementConfig) => {
  const { emoji, severity, tags } = stmtMapper(stmt)

  const prefix = `[${emoji} ${severity} ${tags.join(',')}]`
  const message = `${prefix} ${stmt.message}`

  const { message: _message, tags: _tags, ...rest } = stmt

  if (isEmptyObject(rest)) {
    debug(message)
  } else {
    debug(`${message} %O`, rest)
  }
}

interface MakeDebugLogConfig extends MakeLogConfig {
  debug: Debugger
}

/**
 * Factory that returns a `log` function that will print a string + optional
 * data when called.
 *
 * @internal
 */
export const makeDebugLog = ({
  debug,
  should_validate_statement,
  statement_schema
}: MakeDebugLogConfig) => {
  //
  return function log(stmt: any) {
    //
    if (should_validate_statement) {
      const { error, value: validated_stmt } = statement_schema.validate(stmt, {
        allowUnknown: true
      })

      if (error) {
        const message = error.message
          ? `${ERROR_MESSAGE.LOG_STATEMENT_VALIDATION_ERROR_PREFIX}: ${error.message}`
          : `${ERROR_MESSAGE.LOG_STATEMENT_VALIDATION_ERROR_PREFIX}: error does not have a message`

        throw new Error(message)
      }

      if (shouldLog(validated_stmt)) {
        logStatement({ debug, stmt: validated_stmt })
      }
    } else {
      if (shouldLog(stmt)) {
        logStatement({ debug, stmt })
      }
    }
  }
}
