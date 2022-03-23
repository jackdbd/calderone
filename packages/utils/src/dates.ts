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

export const addDays = (date: Date, n: number) => {
  debug('addDays %s %d', date, n)
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export const nowAndPastUTC = (n: number) => {
  const now = new Date().toISOString()
  const date_utc = new Date(now)
  date_utc.setUTCDate(date_utc.getUTCDate() - n)
  return { past: date_utc.toISOString(), now }
}

export const nowAndFutureUTC = (n: number) => {
  const now = new Date().toISOString()
  const date_utc = new Date(now)
  date_utc.setUTCDate(date_utc.getUTCDate() + n)
  return { future: date_utc.toISOString(), now }
}

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
 * Return a date string in italian locale. The input `ts` is a timestamp in
 * seconds since the Unix epoch.
 */
export const itDateString = (ts: number) => {
  return new Date(ts * 1000).toLocaleDateString(
    'it-IT',
    DATE_TIME_FORMAT_OPTIONS_IT
  )
}

export const itDateStringAfterNDays = (date_string: string, n_days: number) => {
  const d = new Date(date_string.split('/').reverse().join('/'))
  d.setDate(d.getDate() + n_days)
  return d.toLocaleDateString('it-IT', DATE_TIME_FORMAT_OPTIONS_IT)
}
