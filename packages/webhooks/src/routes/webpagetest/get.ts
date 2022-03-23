import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import type { GoogleSpreadsheet } from 'google-spreadsheet'
import { sendTelegramMessage } from '@jackdbd/notifications'
import { operationListText } from '@jackdbd/telegram-text-messages'
// import { AUTH_STRATEGY } from './utils.js'

interface Config {
  doc: GoogleSpreadsheet
  service_name: string
  service_version: string
  telegram_chat_id: string
  telegram_token: string
}

export const webPageTestPingbackGet = ({
  doc,
  service_name,
  service_version,
  telegram_chat_id,
  telegram_token
}: Config): Hapi.ServerRoute => {
  const config = { method: 'GET', path: '/webpagetest' }

  const wpt_results_sheet = doc.sheetsByTitle['wpt_results']

  return {
    method: config.method,
    options: { auth: false },
    // options: { auth: AUTH_STRATEGY.allow_pingbacks_from_webpagetest_api },
    path: config.path,
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      // const { remoteAddress } = request.info

      request.log(['webpagetest', 'debug'], {
        message: 'request from WebPageTest pingback'
      })

      const test_id = request.query.id
      if (!test_id) {
        return {
          message: 'incoming GET request has no `id` in the query string'
        }
      }

      const successes: string[] = []
      const failures: string[] = []
      const warnings: string[] = []

      const test_result_url = `https://www.webpagetest.org/result/${test_id}/`

      let message = ''
      try {
        const row = await wpt_results_sheet.addRow({
          test_id,
          url: test_result_url
        })
        message = `added row[${row.rowIndex}] ${row.a1Range} in Google Sheet ${doc.title} for WebPageTest ${test_id}`
        request.log(['webpagetes', 'debug'], { message })
        successes.push(message)
      } catch (err: any) {
        message = `failed to add row for WebPageTest ID ${test_id}`
        request.log(['webpagetest', 'error'], {
          message,
          original_error_message: err.message
        })
        failures.push(message)
      }

      try {
        const { message, delivered, delivered_at } = await sendTelegramMessage({
          chat_id: telegram_chat_id,
          token: telegram_token,
          text: operationListText({
            app_name: service_name,
            app_version: service_version,
            description: `test ID <a href="${test_result_url}" target="_blank">${test_id}</a> is ready`,
            operations: [
              {
                successes,
                failures,
                warnings,
                title: 'pingback from WebPageTest'
              }
            ]
          })
        })
        request.log(['telegram', 'debug'], { message, delivered, delivered_at })
      } catch (err: any) {
        const message = `could not send Telegram message`
        request.log(['telegram', 'warning'], {
          message,
          original_error_message: err.message
        })
        warnings.push(message)
      }

      if (failures.length === 0) {
        return { message, successes, warnings }
      } else {
        throw Boom.internal(message)
      }
    }
  }
}
