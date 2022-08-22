import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { sendTelegramMessage } from '@jackdbd/notifications'
import { operationListText } from '@jackdbd/telegram-text-messages'
import type { GoogleSpreadsheet } from 'google-spreadsheet'
import Joi from 'joi'
import { problemDetails } from './utils.js'

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
  const wpt_results_sheet = doc.sheetsByTitle['wpt_results']

  return {
    method: 'GET',

    handler: async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      // const { remoteAddress } = request.info

      request.log(['webpagetest', 'debug'], {
        message: 'request from WebPageTest pingback'
      })

      const test_id = request.query.id as number

      const successes: string[] = []
      const failures: string[] = [] // these ones should be expressed as the problem details format
      const warnings: string[] = []

      const test_result_url = `https://www.webpagetest.org/result/${test_id}/`

      let message = ''
      try {
        const row = await wpt_results_sheet.addRow({
          test_id,
          url: test_result_url
        })
        message = `added row[${row.rowIndex}] ${row.a1Range} in Google Sheet ${doc.title} for WebPageTest ${test_id}`
        request.log(['webpagetest', 'debug'], { message })
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
        return h.response({ message, successes, warnings }).code(200)
      } else {
        throw Boom.internal(message)
      }
    },

    options: {
      auth: false,
      description: 'WebPageTest pingback',
      notes:
        'This route catches the pingback (kind of a webhook) sent by the [WebPageTest API](https://docs.webpagetest.org/api/)',
      tags: ['api'],
      validate: {
        failAction: (request, h, error) => {
          if (error) {
            const status_code = (error as any).output.statusCode as number
            return h
              .response(problemDetails(request, error))
              .code(status_code)
              .takeover()
          } else {
            return h
              .response({ message: 'Internal Server Error' })
              .code(500)
              .takeover()
          }
        },
        payload: false,
        query: Joi.object({
          // id: Joi.number().min(1).required()
          // I think that a WebPageTest ID should be 17 characters. For example,
          // this is a valid ID: 220528_AiDcVP_4RF
          id: Joi.string().min(6).max(20).required()
        })
      }
    },

    path: '/webpagetest'
  }
}
