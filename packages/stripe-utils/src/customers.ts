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
