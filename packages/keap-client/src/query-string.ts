import makeDebug from 'debug'
import type { Pagination } from './pagination.js'

const debug = makeDebug('keap-client/query-string')

export const queryString = (
  { email, limit, offset, order, order_direction, since, until }: Pagination,
  optional_properties?: string
) => {
  let qs = ''

  if (limit) {
    qs = `${qs}&limit=${limit}`
  }

  if (email) {
    qs = `${qs}&email=${email}`
  }

  if (offset) {
    qs = `${qs}&offset=${offset}`
  }

  if (optional_properties) {
    qs = `${qs}&optional_properties=${optional_properties}`
  }

  if (order) {
    qs = `${qs}&order=${order}`
  }

  if (order_direction) {
    qs = `${qs}&order_direction=${order_direction}`
  }

  if (since) {
    qs = `${qs}&since=${since}`
  }

  if (until) {
    qs = `${qs}&until=${until}`
  }

  if (qs && qs[0] === '&') {
    qs = qs.slice(1)
  }

  debug(`query string [${qs}]`)
  return qs
}

export const queryStringFromNextUrl = (
  next_url: string,
  optional_properties?: string
) => {
  // eslint-disable-next-line prefer-const
  let [_base_url, qs] = next_url.split('?')

  if (optional_properties) {
    qs = `${qs}&optional_properties=${optional_properties}`
  }

  debug(`next URL ${next_url} => query string [${qs}]`)
  return qs
}
