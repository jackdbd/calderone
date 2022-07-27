// import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { sendTelegramMessage } from '@jackdbd/notifications'

interface Config {
  telegram_chat_id: string
  telegram_token: string
}

// https://docs.npmjs.com/cli/v8/commands/npm-hook

export const npmPost = ({
  telegram_chat_id,
  telegram_token
}: Config): Hapi.ServerRoute => {
  const config = { method: 'POST', path: '/npm' }
  const tags = ['handler', 'npm', 'webhook']
  return {
    method: config.method,
    options: {
      auth: false,
      description: 'webhook target for npm hooks',
      notes:
        'This route catches the webhook events sent by npm when a package is published',
      tags
      // validate: {
      //   payload: Joi.object({
      //     incident: Joi.any()
      //   }),
      //   query: false
      // }
    },
    path: config.path,
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      const payload = request.payload as any

      const text = JSON.stringify(payload, null, 2)

      // https://blog.npmjs.org/post/145260155635/introducing-hooks-get-notifications-of-npm
      // https://github.com/npm/npm-hook-receiver/blob/master/index.js
      // https://github.com/npm/npm-hook-slack/blob/master/index.js

      const signature = request.headers['x-npm-signature']
      console.log(`npm hook signature is ${signature}`, signature)
      request.log(tags, {
        message: `npm hook signature is ${signature}`,
        signature
      })
      //   const hookOwner = payload.hookOwner
      //   const username = payload.hookOwner.username

      const successes: string[] = []
      const failures: string[] = []
      const warnings: string[] = []

      try {
        const { message, delivered, delivered_at } = await sendTelegramMessage({
          chat_id: telegram_chat_id,
          token: telegram_token,
          text
        })

        if (delivered) {
          request.log([...tags, 'telegram'], {
            message,
            delivered,
            delivered_at
          })
          successes.push(message)
        } else {
          request.log([...tags, 'telegram', 'warning'], {
            message
          })
          warnings.push(message)
        }
      } catch (err: any) {
        const message = `could not send Telegram message`
        request.log([...tags, 'telegram', 'error'], {
          message,
          original_error_message: err.message
        })
        failures.push(message)
      }

      if (failures.length === 0) {
        return {
          message: `npm webhook processed successfully`,
          successes,
          warnings
        }
      } else {
        return {
          message: `failed to process npm webhook`,
          failures,
          warnings
        }
      }
    }
  }
}
