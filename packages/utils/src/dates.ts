import makeDebug from 'debug'

const debug = makeDebug('utils/dates')

export const dateFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
export const LOCALE_STRING_OPTIONS = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
} as any

/**
 * Add `n` days to an input `date`.
 *
 * @public
 *
 * @param date - The input date
 * @param n - The number of days
 * @returns A date `d`
 */
export const addDays = (date: Date, n: number) => {
  debug('addDays %s %d', date, n)
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

/**
 * @public
 */
export const nowAndPastUTC = (n: number) => {
  debug('nowAndPastUTC %d', n)
  const now = new Date().toISOString()
  const date_utc = new Date(now)
  date_utc.setUTCDate(date_utc.getUTCDate() - n)
  return { past: date_utc.toISOString(), now }
}

/**
 * @public
 */
export const nowAndFutureUTC = (n: number) => {
  debug('nowAndFutureUTC %d', n)
  const now = new Date().toISOString()
  const date_utc = new Date(now)
  date_utc.setUTCDate(date_utc.getUTCDate() + n)
  return { future: date_utc.toISOString(), now }
}

/**
 * @public
 */
export const nowAndPastTimestampMs = (n: number) => {
  const now = new Date().toISOString()
  const date_utc = new Date(now)
  const ts_now = date_utc.getTime()
  date_utc.setUTCDate(date_utc.getUTCDate() - n)
  const ts_past = date_utc.getTime()
  return { ts_past, ts_now }
}

const DATE_TIME_FORMAT_OPTIONS_IT = {
  day: '2-digit' as const,
  month: '2-digit' as const,
  year: 'numeric' as const
}

/**
 * Returns a date string in italian locale. The input `ts` is a timestamp in
 * seconds since the Unix epoch.
 *
 * @public
 */
export const itDateString = (ts: number) => {
  debug('itDateString %s', ts)
  if (ts < 0) {
    throw new Error('UNIX timestamp cannot be negative')
  }
  return new Date(ts * 1000).toLocaleDateString(
    'it-IT',
    DATE_TIME_FORMAT_OPTIONS_IT
  )
}

/**
 * @public
 */
export const itDateStringAfterNDays = (date_string: string, n_days: number) => {
  const d = new Date(date_string.split('/').reverse().join('/'))
  d.setDate(d.getDate() + n_days)
  return d.toLocaleDateString('it-IT', DATE_TIME_FORMAT_OPTIONS_IT)
}

export interface UTCDateAsObject {
  year: string
  month: string
  day: string
  hour: string
  minute: string
  second: string
  ms: string
}

/**
 * Converts a `Date` object into a simple JavaScript object where each field is
 * a left-padded string.
 *
 * @public
 *
 * @param date - The input date
 */
export const utcObjectFromDate = (date: Date): UTCDateAsObject => {
  return {
    year: `${date.getUTCFullYear()}`,
    month: `${date.getUTCMonth() + 1}`.padStart(2, '0'),
    day: `${date.getUTCDate()}`.padStart(2, '0'),
    hour: `${date.getUTCHours()}`.padStart(2, '0'),
    minute: `${date.getUTCMinutes()}`.padStart(2, '0'),
    second: `${date.getUTCSeconds()}`.padStart(2, '0'),
    ms: `${date.getUTCMilliseconds()}`.padStart(2, '0')
  }
}

export interface IsoStringConfig {
  year?: string | number
  month?: string | number
  day?: string | number
  hour?: string | number
  minute?: string | number
  second?: string | number
  ms?: string | number
}

/**
 * Given a JS object that represents a UTC date, and an `options` object that
 * contains `year`, `month`, etc, this function generates a new ISO string for
 * the new date.
 *
 * @public
 */
export const isoString = (
  obj: UTCDateAsObject,
  options: IsoStringConfig = {}
) => {
  const year = options.year ? `${options.year}` : obj.year

  const month =
    options.month !== undefined
      ? `${options.month}`.padStart(2, '0')
      : obj.month

  const day =
    options.day !== undefined ? `${options.day}`.padStart(2, '0') : obj.day

  const hour =
    options.hour !== undefined ? `${options.hour}`.padStart(2, '0') : obj.hour

  const minute =
    options.minute !== undefined
      ? `${options.minute}`.padStart(2, '0')
      : obj.minute

  const second =
    options.second !== undefined
      ? `${options.second}`.padStart(2, '0')
      : obj.second

  const ms =
    options.ms !== undefined ? `${options.ms}`.padStart(3, '0') : obj.ms

  return `${year}-${month}-${day}T${hour}:${minute}:${second}.${ms}Z`
}
