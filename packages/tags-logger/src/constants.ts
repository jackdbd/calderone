interface EmojiMap {
  [severity: string]: string
}

/**
 * Emojis!
 *
 * @internal
 *
 * @see [Emojipedia](https://emojipedia.org/)
 */
export const EMOJI: EmojiMap = {
  debug: '🔍',
  info: 'ℹ️',
  notice: '💬',
  warning: '⚠️',
  error: '❌',
  critical: '🔥',
  alert: '🚨',
  emergency: '💀'
}

/**
 * Severity values supported by this logger.
 *
 * @internal
 *
 * @remarks You **must** include **exactly one** severity value in the `tags`
 * array of a log statement.
 *
 * @see [LogSeverity - Google Cloud Operations Suite](https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity)
 */
export const SEVERITY_TAG_VALUES = [
  'debug',
  'info',
  'notice',
  'warning',
  'error',
  'critical',
  'alert',
  'emergency'
]

export const SEVERITY_TAG_LABEL = `severity tag (${SEVERITY_TAG_VALUES.join(
  ', '
)})`

export const ERROR_MESSAGE = {
  DEBUG_IS_NOT_SET: `environment variable DEBUG is not set`,
  LOG_STATEMENT_VALIDATION_ERROR_PREFIX: `Log statement validation error`,
  NAMESPACE_NOT_INCLUDED_IN_DEBUG: `namespace is not included in the DEBUG environment variable`,
  NO_TAG_MATCHED_KNOWN_SEVERITY_LEVEL: `no tag matched a known severity level`,
  TAGS_IS_EMPTY_ARRAY: `tags is an empty array`
}
