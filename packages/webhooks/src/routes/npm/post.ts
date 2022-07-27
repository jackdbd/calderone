import Joi from 'joi'
import type Hapi from '@hapi/hapi'
import { sendTelegramMessage } from '@jackdbd/notifications'

interface Config {
  telegram_chat_id: string
  telegram_token: string
}

// https://docs.npmjs.com/cli/v8/commands/npm-hook

const TAGS = ['api', 'handler', 'npm', 'webhook']

export const npmPost = ({
  telegram_chat_id,
  telegram_token
}: Config): Hapi.ServerRoute => {
  return {
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      const payload = request.payload as any

      const { event, name, type, version, hookOwner } = payload
      const username = hookOwner.username
      const distTags = payload.payload['dist-tags']
      const { author, description, keywords } = payload.payload

      const obj = {
        event,
        name,
        type,
        version,
        username,
        distTags,
        description,
        author,
        keywords,
        headers: request.headers
      }

      request.log(TAGS, {
        message: `recevied webhook event ${event}`,
        ...obj
      })

      const text = JSON.stringify(obj, null, 2)

      // https://blog.npmjs.org/post/145260155635/introducing-hooks-get-notifications-of-npm
      // https://github.com/npm/npm-hook-receiver/blob/master/index.js
      // https://github.com/npm/npm-hook-slack/blob/master/index.js

      const signature = request.headers['x-npm-signature']
      // TODO: check that this header is correct. Otherwise return a HTTP 400.

      request.log(TAGS, {
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
          request.log([...TAGS, 'telegram'], {
            message,
            delivered,
            delivered_at
          })
          successes.push(message)
        } else {
          request.log([...TAGS, 'telegram', 'warning'], {
            message
          })
          warnings.push(message)
        }
      } catch (err: any) {
        const message = `could not send Telegram message`
        request.log([...TAGS, 'telegram', 'error'], {
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
    },

    method: 'POST',

    options: {
      auth: false,
      description: 'webhook target for npm hooks',
      notes:
        'This route catches the webhook events sent by npm when a package is published',
      tags: TAGS,
      validate: {
        options: { allowUnknown: true },
        payload: Joi.object({
          event: Joi.string().min(1),
          name: Joi.string().min(1),
          hookOwner: Joi.object({
            username: Joi.string().min(1)
          }),
          payload: Joi.object({
            author: Joi.any(),
            description: Joi.string().min(1),
            'dist-tags': Joi.any(),
            keywords: Joi.array().items(Joi.string().min(1))
          }),
          type: Joi.string().min(1),
          version: Joi.string().min(1)
        }),
        query: false
      }
    },

    path: '/npm'
  }
}
