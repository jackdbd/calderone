import type Stripe from 'stripe'
import { customersWithDuplicateEmails } from '@jackdbd/stripe-utils'
import type { CustomersByEmail } from '@jackdbd/stripe-utils'
import { nowAndPastTimestampMs } from '@jackdbd/utils/dates'

export interface Config {
  stripe: Stripe
  ts_ms_begin?: number
  ts_ms_end?: number
}

// export interface Options {
//   stripe_request_options?: Stripe.RequestOptions
// }

// const DEFAULT_OPTIONS: Required<Options> = {
//   stripe_request_options: { apiVersion: '2022-08-01' }
// }

export interface ReportData {
  query: string
  n_total: number
  customers_by_email: CustomersByEmail
  ts_ms_begin: number
  ts_ms_end: number
}

export const reportData = async (
  config: Config
  //   options: Options = DEFAULT_OPTIONS
): Promise<ReportData> => {
  const { stripe } = config

  //   const stripe_request_options =
  //     options.stripe_request_options !== undefined
  //       ? options.stripe_request_options
  //       : DEFAULT_OPTIONS.stripe_request_options

  let ts_ms_begin: number
  if (config.ts_ms_begin) {
    ts_ms_begin = config.ts_ms_begin
  } else {
    const { ts_past } = nowAndPastTimestampMs(90)
    ts_ms_begin = ts_past
  }

  let ts_ms_end: number
  if (config.ts_ms_end) {
    ts_ms_end = config.ts_ms_end
  } else {
    const { ts_past } = nowAndPastTimestampMs(0)
    ts_ms_end = ts_past
  }

  if (ts_ms_begin > ts_ms_end) {
    throw new Error(`ts_ms_begin can't be > ts_ms_end`)
  }

  const { customers_by_email, query, n_total } =
    await customersWithDuplicateEmails({
      stripe,
      ts_ms_begin,
      ts_ms_end
    })

  return { customers_by_email, n_total, query, ts_ms_begin, ts_ms_end }
}
