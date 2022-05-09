import { env } from 'node:process'
import type { ErrorReporting } from '@google-cloud/error-reporting'
import { send } from '@jackdbd/notifications/telegram'
import { errorText } from '@jackdbd/telegram-text-messages'
import { logCritical, logWarning } from '@jackdbd/utils/logger'
import { provision } from './provision.js'

let app_name: string
let app_version: string
let cloud_run_logs_href: string
let error_reporting: ErrorReporting | undefined
let telegram_chat_id: string
let telegram_token: string

provision(env)
  .then((cfg) => {
    cloud_run_logs_href = cfg.cloud_run_logs_href
    error_reporting = cfg.error_reporting
    telegram_chat_id = cfg.telegram_chat_id
    telegram_token = cfg.telegram_token
  })
  .catch(async (err: any) => {
    if (error_reporting) {
      error_reporting.report(err)
    } else {
      logCritical({
        message: `GLOBAL CATCH ALL could not report error to GCP because Error Reporting was not yet initialized: ${err.message}`
      })
    }

    try {
      await send({
        chat_id: telegram_chat_id,
        token: telegram_token,
        text: errorText({
          app_name,
          app_version,
          error_message: err.message,
          error_title: 'global catch all',
          links: [
            {
              href: cloud_run_logs_href,
              text: 'Cloud Run logs'
            }
          ]
        })
      })
    } catch (err: any) {
      logWarning({
        message: `could not send Telegram message: ${err.message}`
      })
    }
  })
