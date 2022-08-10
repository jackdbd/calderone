import { SEVERITY_TAG_VALUES } from './constants.js'

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
 * Checks whether the passed value is an empty JavaScript Object.
 *
 * @internal
 */
export const isEmptyObject = (obj: any) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
