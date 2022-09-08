import yargs from 'yargs'
import { StripeApiMode } from '@jackdbd/stripe-utils'
import { sendTelegramMessage } from '@jackdbd/notifications'
import { nowAndPastTimestampMs } from '@jackdbd/utils/dates'
import { Emoji } from '../constants.js'
import { reportData } from './report-events/data.js'
import {
  report,
  renderToStdOut,
  renderToTelegram
} from './report-events/index.js'
import { stripeClient } from './utils.js'
import { localJSONSecret } from '../utils.js'

const EVENT_TYPES = [
  'customer.created',
  'customer.updated',
  'customer.subscription.updated',
  'invoice.paid'
  //   'payment_intent.succeeded'
]

interface Argv {
  'api-mode': StripeApiMode
  days: number
  events: string
  reports: string
}

const DEFAULT: Argv = {
  'api-mode': StripeApiMode.Test,
  days: 7,
  events: EVENT_TYPES.join(','),
  reports: 'telegram,stdout'
}

export const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .describe('days', 'check Stripe events created in the last N days')
    .describe('api-mode', 'use Stripe account in this mode')
    .choices('api-mode', [StripeApiMode.Live, StripeApiMode.Test])
    .describe('events', 'restrict the report to these Stripe event types')
    .describe(
      'reports',
      'generate report and send it via one or more of: email,stdout,telegram'
    )
    .default(DEFAULT).argv as Argv

  const stripe = await stripeClient(StripeApiMode.Test)

  const n_days = argv.days
  const { ts_past } = nowAndPastTimestampMs(n_days)
  const ts_past_seconds = Math.floor(ts_past / 1000.0)

  const event_types = argv.events.split(',')

  // There is nothing to expand in a Stripe Event object.
  // https://stripe.com/docs/api/events/object
  // expand: ['data.foo'],
  const stripe_event_list_params = {
    created: { gte: ts_past_seconds },
    // delivery_success: true,
    types: event_types
  }

  const { data } = await reportData({
    stripe,
    stripe_event_list_params
  })

  const reports = argv.reports.split(',')

  const obj = report({
    data,
    data_source: `Stripe API, after UNIX timestamp ${ts_past_seconds} (in seconds)`
  })

  if (reports.includes('email')) {
    console.log(`\nWARNING: email report not implemented!\n`)
  }

  if (reports.includes('stdout')) {
    console.log(renderToStdOut(obj))
  }

  if (reports.includes('telegram')) {
    const { chat_id, token } = await localJSONSecret(`telegram.json`)

    const chunk_size = 5
    // if we have too many entries, the report would exceed the MAX_CHARS
    // allowed in a Telegram text message, so we send multiple messages.
    if (obj.entries.length > chunk_size) {
      for (let i = 0; i < data.length; i += chunk_size) {
        const range_end = Math.min(i + chunk_size - 1, data.length - 1)

        try {
          const { message } = await sendTelegramMessage(
            {
              chat_id,
              text: renderToTelegram({
                title: obj.title,
                entries: obj.entries.slice(i, range_end + 1)
              }),
              token
            },
            { disable_web_page_preview: true }
          )
          console.log(`${Emoji.Notification} Telegram: ${message}`)
        } catch (err: any) {
          console.log(`${Emoji.Failure} Telegram: ${err.message}`)
        }
      }
    } else {
      try {
        const { message } = await sendTelegramMessage(
          { chat_id, text: renderToTelegram(obj), token },
          { disable_web_page_preview: true }
        )
        console.log(`${Emoji.Notification} Telegram: ${message}`)
      } catch (err: any) {
        console.log(`${Emoji.Failure} Telegram: ${err.message}`)
      }
    }
  }
}

main()
