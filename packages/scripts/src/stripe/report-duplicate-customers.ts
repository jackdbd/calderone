import yargs from 'yargs'
import { StripeApiMode } from '@jackdbd/stripe-utils'
import {
  sendEmailViaSendGrid,
  sendTelegramMessage
} from '@jackdbd/notifications'
import { Emoji } from '../constants.js'
import { localJSONSecret } from '../utils.js'
import { stripeClient } from './utils.js'
import { reportData, report } from './report-duplicate-customers/index.js'

interface Argv {
  'api-mode': StripeApiMode
  reports: string
  'ts-ms-begin'?: number
  'ts-ms-end'?: number
}

const DEFAULT: Argv = {
  'api-mode': StripeApiMode.Test,
  reports: 'email,telegram,stdout',
  // https://www.unixtimestamp.com/
  'ts-ms-begin': undefined,
  'ts-ms-end': undefined
}

export const main = async () => {
  const argv = yargs(process.argv.slice(2))
    .describe('api-mode', 'use Stripe account in this mode')
    .choices('api-mode', [StripeApiMode.Live, StripeApiMode.Test])
    .describe(
      'reports',
      'generate report and send it via one or more of: email,stdout,telegram'
    )
    .default(DEFAULT).argv as Argv

  const api_mode = argv['api-mode']
  const livemode = api_mode === 'LIVE' ? true : false
  const stripe = await stripeClient(api_mode)

  const data = await reportData({
    stripe,
    ts_ms_begin: argv['ts-ms-begin'],
    ts_ms_end: argv['ts-ms-end']
  })

  const { html, text } = report({ data, livemode })

  const reports = argv.reports.split(',')

  if (reports.includes('email')) {
    const {
      api_key: sendgrid_api_key,
      from: email_from,
      to: email_to
    } = await localJSONSecret('sendgrid.json')

    if (!email_to) {
      throw new Error(`no email_to specified`)
    }

    const date_str = new Date().toUTCString()
    const subject = `Duplicate customer emails in Stripe account (${date_str})`

    const response = await sendEmailViaSendGrid({
      from: email_from,
      to: email_to,
      sendgrid_api_key,
      subject,
      html
    })

    console.log(
      `${Emoji.MailboxWithRaisedFlag} ${response.message} (sendgrid message id: ${response.sendgrid_message_id})`
    )
  }

  if (reports.includes('stdout')) {
    console.log(text)
  }

  if (reports.includes('telegram')) {
    const { chat_id, token } = await localJSONSecret(`telegram.json`)
    try {
      const { message } = await sendTelegramMessage(
        { chat_id, text, token },
        { disable_web_page_preview: true }
      )
      console.log(`${Emoji.Notification} Telegram: ${message}`)
    } catch (err: any) {
      console.log(`${Emoji.Failure} Telegram: ${err.message}`)
    }
  }
}

main()
