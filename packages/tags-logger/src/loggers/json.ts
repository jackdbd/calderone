import {
  logDebug,
  logInfo,
  logNotice,
  logWarning,
  logError,
  logCritical,
  logAlert,
  logEmergency
} from '@jackdbd/utils/logger'
import { ERROR_MESSAGE } from '../constants.js'
import type { Statement } from '../schemas.js'
import { stmtMapper } from '../utils.js'
import type { MakeLogConfig } from './interfaces.js'

interface LogStatementConfig {
  stmt: Statement
}

interface TagMap {
  [tag: string]: boolean
}

const tagReducer = (m: TagMap, tag: string) => {
  m[tag] = true
  return m
}

const logStatement = ({ stmt }: LogStatementConfig) => {
  const { severity, tags } = stmtMapper(stmt)

  const { message, tags: tag_array, ...rest } = stmt

  const tag_dict = tags.reduce(tagReducer, {})

  switch (severity) {
    case 'debug': {
      logDebug({ message, tag_array, tag_dict, ...rest })
      break
    }
    case 'info': {
      logInfo({ message, tag_array, tag_dict, ...rest })
      break
    }
    case 'notice': {
      logNotice({ message, tag_array, tag_dict, ...rest })
      break
    }
    case 'warning': {
      logWarning({ message, tag_array, tag_dict, ...rest })
      break
    }
    case 'error': {
      logError({ message, tag_array, tag_dict, ...rest })
      break
    }
    case 'critical': {
      logCritical({ message, tag_array, tag_dict, ...rest })
      break
    }
    case 'alert': {
      logAlert({ message, tag_array, tag_dict, ...rest })
      break
    }
    case 'emergency': {
      logEmergency({ message, tag_array, tag_dict, ...rest })
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
 * Factory that returns a `log` function that will print a JSON string when called.
 *
 * @internal
 */
export const makeJSONLog = ({
  should_validate_statement,
  statement_schema
}: MakeLogConfig) => {
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
      logStatement({ stmt: validated_stmt })
    } else {
      logStatement({ stmt })
    }
  }
}
