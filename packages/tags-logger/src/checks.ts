import { SEVERITY_TAG_VALUES } from './constants.js'
import type { Statement } from './schemas.js'

const splitsEnvVar = (k: string) => {
  if (process.env[k]) {
    return process.env[k]!.split(',')
  } else {
    return []
  }
}

/**
 * Comparator function that checks whether **at least one** of two strings is a
 * severity value.
 *
 * @internal
 */
export const hasAtLeastOneSeverityTag = (a: string, b: string) => {
  if (SEVERITY_TAG_VALUES.includes(a) && SEVERITY_TAG_VALUES.includes(b)) {
    return true
  } else {
    return false
  }
}

/**
 * Checks whether a `namespace` shows up in the environment variable `DEBUG`.
 *
 * @internal
 */
export const isNamespaceInEnvVarDEBUG = (namespace: string) => {
  return splitsEnvVar('DEBUG').includes(namespace)
}

/**
 * Checks whether a `tag` shows up in the environment variable `LOGGER_TAGS`.
 *
 * @internal
 */
const isTagInEnvVarLOGGER_TAGS = (tag: string) => {
  return splitsEnvVar('LOGGER_TAGS').includes(tag)
}

/**
 * Checks whether the passed value is an empty JavaScript Object.
 *
 * @internal
 */
export const isEmptyObject = (obj: any) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

/**
 * Checks whether a log statement `stmt` should be logged or not (on the basis
 * of the value of the environment variable `LOGGER_TAGS`).
 *
 * @internal
 *
 * @remarks This function affects only the debug logger, not the JSON logger.
 */
export const shouldLog = (stmt: Statement) => {
  if (!stmt) {
    return false
  }

  if (!stmt.tags) {
    return false
  }

  if (process.env.LOGGER_TAGS) {
    return stmt.tags.filter(isTagInEnvVarLOGGER_TAGS).length > 0
  } else {
    return true
  }
}
