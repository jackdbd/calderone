import type Stripe from 'stripe'

/**
 * @public
 */
export interface EmailIds {
  [email: string]: string[]
}

/**
 * @public
 */
export interface DuplicatesConfig {
  stripe: Stripe
  threshold?: number
  ts_start: number
  ts_stop: number
}

/**
 * Emails that appear more than `threshold` times in the given Stripe account.
 * The search is restricted to the time range starting from `ts_start` to
 * `ts_stop` (both excluded, and both expressed in Unix timestamps in seconds).
 *
 * @public
 */
export const duplicates = async ({
  stripe,
  threshold = 1,
  ts_start,
  ts_stop
}: DuplicatesConfig) => {
  const email_ids: EmailIds = {}

  for await (const cus of stripe.customers.list({
    created: { gt: ts_start, lt: ts_stop }
  })) {
    if (cus.email) {
      if (email_ids[cus.email]) {
        email_ids[cus.email].push(cus.id)
      } else {
        email_ids[cus.email] = [cus.id]
      }
    } else {
      console.log(`⚠️ Stripe customer ${cus.id} has no email`)
    }
  }

  const reduced = Object.entries(email_ids).reduce((acc, [email, ids]) => {
    if (ids.length > threshold) {
      return { ...acc, [email]: ids }
    } else {
      return acc
    }
  }, {} as EmailIds)

  return reduced
}

export interface ConfigCustomersWithDuplicateEmails {
  stripe: Stripe

  /**
   * Timestamp for when to begin the search, in ms.
   * https://www.unixtimestamp.com/
   */
  ts_ms_begin: number

  /**
   * Timestamp for when to end the search, in ms.
   */
  ts_ms_end: number
}

export interface CustomersByEmail {
  [email: string]: { id: string; name?: string }[]
}

/**
 * Finds all customers whose email appear more than once in the Stripe account.
 *
 * The search is restricted to the time interval `[ts_md_begin, ts_md_end]`.
 */
export const customersWithDuplicateEmails = async ({
  stripe,
  ts_ms_begin,
  ts_ms_end
}: ConfigCustomersWithDuplicateEmails) => {
  if (ts_ms_begin > ts_ms_end) {
    throw new Error(`ts_ms_begin can't be > ts_ms_end`)
  }

  const created_seconds_begin = Math.floor(ts_ms_begin / 1000.0)
  const created_seconds_end = Math.floor(ts_ms_end / 1000.0)

  const query = `created>=${created_seconds_begin} AND created<=${created_seconds_end}`

  let n_total = 0
  const tmp_customers_by_email: CustomersByEmail = {}
  for await (const cus of stripe.customers.search({ query })) {
    n_total++

    if (cus.email) {
      const c = {
        id: cus.id,
        name: cus.name || undefined
      }
      if (tmp_customers_by_email[cus.email]) {
        tmp_customers_by_email[cus.email].push(c)
      } else {
        tmp_customers_by_email[cus.email] = [c]
      }
    }
  }

  const customers_by_email = Object.entries(tmp_customers_by_email).reduce(
    (acc, cv) => {
      const [email, occurrences] = cv
      return occurrences.length > 1 ? { ...acc, [email]: occurrences } : acc
    },
    {}
  )

  return { customers_by_email, query, n_total }
}
