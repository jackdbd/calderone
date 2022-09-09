import yargs from 'yargs'
import { StripeApiMode } from '@jackdbd/stripe-utils'
import { nowAndPastUTC } from '@jackdbd/utils/dates'
import { stripeClient } from './utils.js'

interface Argv {
  days: number
  'api-mode': StripeApiMode
}

const DEFAULT: Argv = {
  days: 30,
  'api-mode': StripeApiMode.Test
}

interface Result {
  n_total: number
}

export const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .describe('days', 'check Stripe customers created in the last N days')
    .describe('api-mode', 'use Stripe account in this mode')
    .choices('api-mode', [StripeApiMode.Live, StripeApiMode.Test])
    .default(DEFAULT).argv as Argv

  const stripe = await stripeClient(argv['api-mode'])

  const { now, past } = nowAndPastUTC(argv.days)
  const ts_start = Math.floor(new Date(past).getTime() / 1000.0)
  const ts_stop = Math.floor(new Date(now).getTime() / 1000.0)

  const result: Result = {
    n_total: 0
  }

  for await (const cus of stripe.customers.list({
    created: { gt: ts_start, lt: ts_stop }
  })) {
    result.n_total++

    const date = new Date(cus.created * 1000)
    const created_at = date.toISOString()
    console.log(
      `${cus.id} created at ${created_at} (livemode: ${cus.livemode})`
    )
  }

  console.log(`${result.n_total} customers were created from ${past} to ${now}`)
}

main()
