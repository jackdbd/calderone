import { debuglog } from 'node:util'
import phin from 'phin'

const debug = debuglog('notifications/telegram')

// https://core.telegram.org/bots/api#chat
interface Chat {
  description?: string
  first_name?: string
  id: number
  last_name?: string
  title?: string
  type: 'private' | 'group' | 'supergroup' | 'channel'
  username?: string
}

// https://core.telegram.org/bots/api#user
interface User {
  first_name: string
  id: number
  is_bot: boolean
  last_name?: string
  username?: string
}

interface TelegramAPISendMessageError {
  description: string
  error_code: number
  ok: boolean
}

interface TelegramAPISendMessageSuccess {
  ok: boolean
  result: {
    chat: Chat
    date: number // unix timestamp
    from: User
    message_id: number
    text?: string
  }
}

// https://core.telegram.org/bots/api#message
type SendMessageResponseBody =
  | TelegramAPISendMessageError
  | TelegramAPISendMessageSuccess

export interface Config {
  /**
   * Unique identifier for the target chat or username of the target Telegram
   * channel (in the format @channelusername).
   */
  chat_id: string

  /**
   * Text of the message to be sent, 1-4096 characters after entities parsing.
   */
  text: string

  /**
   * The token of your Telegram bot.
   * https://core.telegram.org/bots/api#authorizing-your-bot
   */
  token: string
}

export interface Options {
  /**
   * Sends the message silently. Users will receive a notification with no sound.
   */
  disable_notification?: boolean
  /**
   * Disables link previews for links in this message.
   */
  disable_web_page_preview?: boolean

  /**
   * https://core.telegram.org/bots/api#formatting-options
   */
  parse_mode?: 'HTML' | 'MarkdownV2'
}

interface ErrorMessageConfig {
  chat_id: string
  description: string
  error_code: number
}

/**
 * https://core.telegram.org/bots/api#making-requests
 */
const errorMessageFromTelegramApi = ({
  chat_id,
  description,
  error_code
}: ErrorMessageConfig) => {
  switch (error_code) {
    case 400: {
      return description
    }
    case 404: {
      return `Telegram chat id ${chat_id} not found`
    }
    default: {
      return description
    }
  }
}

/**
 * Send a text message to a Telegram chat, using the Telegram API.
 *
 * https://core.telegram.org/bots/api#sendmessage
 */
export const send = async (
  { chat_id, text, token }: Config,
  options?: Options
) => {
  if (!chat_id) {
    throw new Error('chat_id not set')
  }
  if (!token) {
    throw new Error('token not set')
  }

  debug(`send Telegram message to chat id ${chat_id}`)
  const data = {
    chat_id,
    disable_notification: options?.disable_notification || true,
    disable_web_page_preview: options?.disable_web_page_preview || false,
    parse_mode: options?.parse_mode || 'HTML',
    text
  }

  try {
    const res = await phin<SendMessageResponseBody>({
      data,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      parse: 'json',
      url: `https://api.telegram.org/bot${token}/sendMessage`
    })

    if (!res.body.ok) {
      const b = res.body as TelegramAPISendMessageError
      debug(
        `Telegram message was NOT delivered to chat id ${chat_id}. Original Telegram API response: %O`,
        b
      )
      return {
        delivered: false,
        message: errorMessageFromTelegramApi({
          chat_id,
          description: b.description,
          error_code: b.error_code
        })
      }
    } else {
      const b = res.body as TelegramAPISendMessageSuccess
      debug(
        `Telegram message delivered to chat id ${chat_id}. Original Telegram API response: %O`,
        b
      )
      const r = b.result
      const delivered_at = new Date(r.date * 1000).toISOString()
      return {
        delivered: true,
        delivered_at,
        message: `message id ${r.message_id} delivered to chat id ${r.chat.id} (username ${r.chat.username}) by bot ${r.from.first_name}`
      }
    }
  } catch (err: any) {
    debug(`Telegram API could not respond. Original error: %O`, err)
    throw new Error(`Telegram API could not respond: ${err.message}`)
  }
}
