import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { logNotice } from '@jackdbd/utils/logger'
import { makeBot } from '../../bot.js'

interface Config {
  telegram_token: string
}

export const homePost = ({ telegram_token }: Config): Hapi.ServerRoute => {
  const config = { method: 'POST', path: '/' }

  const bot = makeBot({ token: telegram_token })
  logNotice({ message: 'Telegram bot created' })

  return {
    method: config.method,
    options: { auth: false },
    path: config.path,
    handler: async (request: Hapi.Request, _h: Hapi.ResponseToolkit) => {
      const payload = request.payload as any

      if (!payload) {
        throw Boom.badRequest()
      }

      if (!payload.message) {
        throw Boom.badRequest()
      }

      if (!payload.update_id) {
        throw Boom.badRequest()
      }

      // https://core.telegram.org/bots/api#update
      const update = {
        callback_query: undefined,
        message: payload.message,
        update_id: payload.update_id
      }
      bot.processUpdate(update)

      return { message: 'update processed' }
    }
  }
}
