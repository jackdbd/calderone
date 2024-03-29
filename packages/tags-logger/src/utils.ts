import { EMOJI, ErrorMessage, SEVERITY_TAG_VALUES } from './constants.js'
import type { Statement } from './schemas.js'

/**
 * Extracts the severity tag and all other tags from a log statement, and picks
 * an appropriate emoji.
 *
 * @remarks
 * The returned `tags` array will **not** include the severity tag.
 *
 * @internal
 */
export const stmtMapper = (stmt: Statement) => {
  let emoji = ''
  let severity = ''
  for (const value of SEVERITY_TAG_VALUES) {
    if (stmt.tags.includes(value)) {
      severity = value
      emoji = EMOJI[severity]
      break
    }
  }

  if (severity === '') {
    throw new Error(ErrorMessage.NO_TAG_MATCHED_KNOWN_SEVERITY_LEVEL)
  }

  const tags = stmt.tags
    .filter((tag) => !SEVERITY_TAG_VALUES.includes(tag))
    .sort((a, b) => a.localeCompare(b))

  if (tags.length === 0) {
    throw new Error(ErrorMessage.TAGS_IS_EMPTY_ARRAY)
  }

  return { emoji, severity, tags }
}
