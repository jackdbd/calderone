declare module 'node-telegram-bot-api' {
  import type stream from 'stream'

  type ChatId = number | string

  export interface PollingOptions {
    autoStart?: boolean
    interval?: number
    params?: { timeout?: number }
    timeout?: number
  }

  export interface WebHookOptions {
    autoOpen?: boolean
    cert?: string
    healthEndpoint?: string
    host?: string
    https?: any
    key?: string
    pfx?: string
    port?: number
  }

  // https://core.telegram.org/bots/api#chat
  export interface Chat {
    first_name: string
    id: ChatId
    last_name: string
    type: 'private' // others?
    username: string
  }

  export interface From {
    first_name: string
    id: number
    is_bot: boolean
    language_code: string
    last_name: string
    username: string
  }

  // https://core.telegram.org/bots/api#user
  export interface User {
    can_join_groups?: boolean
    can_read_all_group_messages?: boolean
    first_name: string
    id: number
    is_bot: boolean
    language_code?: string
    last_name?: string
    supports_inline_queries?: boolean
    username?: string
  }

  // https://core.telegram.org/bots/api#messageentity
  export interface MessageEntity {
    language?: string
    length: number
    offset: number
    type: 'bot_command' // others?
    url?: string
    user?: User
  }

  // https://core.telegram.org/bots/api#message
  export interface Message {
    chat: Chat
    date: number
    entities: MessageEntity[]
    from: From
    text: string
    message_id: number
  }

  // https://core.telegram.org/bots/api#setwebhook
  export interface SetWebHookOptions {
    allowed_updates?: string[]
    // https://core.telegram.org/bots/api#inputfile
    certificate?: any
    ip_address?: string
    max_connections?: number
    url: string
  }

  // https://core.telegram.org/bots/api#webhookinfo
  export interface WebHookInfo {
    allowed_updates?: string[]
    has_custom_certificate: boolean
    ip_address?: string
    last_error_date?: number
    last_error_message?: string
    max_connections?: number
    pending_update_count: number
    url: string
  }

  // https://core.telegram.org/bots/api#sendmessage
  export interface SendMessageOptions {
    parse_mode?: string
    entities?: MessageEntity[]
  }

  // https://core.telegram.org/bots/api#callbackquery
  export interface CallbackQuery {
    chat_instance?: string
    data?: string
    from: User
    game_short_name?: string
    id: number
    inline_message_id?: string
    message?: Message
  }

  // https://core.telegram.org/bots/api#update
  export interface Update {
    callback_query?: CallbackQuery
    message?: Message
    update_id: number
  }

  // TODO
  // https://core.telegram.org/bots/api#callbackquery
  export interface CallbackQueryOptions {
    url: string
  }

  // https://core.telegram.org/bots/api#senddice
  export interface DiceOptions {
    emoji?: string
  }

  // use Event Emitter types?
  type Listener = (message: Message) => void

  type OnTextCallback = (message: Message, match: RegExpMatchArray) => void

  export interface Options {
    badRejection?: boolean
    baseApiUrl?: string
    filepath?: boolean
    onlyFirstMatch?: boolean
    polling?: boolean | PollingOptions
    request?: any
    webHook?: boolean | WebHookConfig
  }

  // https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md
  class TelegramBot {
    constructor(token: string, options?: Options): this

    answerCallbackQuery: (
      callbackQueryid: number,
      options: CallbackQueryOptions
    ) => void

    editMessageText: (text: string, options: any) => void

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotgetwebhookinfooptions--promise
    getWebHookInfo: (options: any) => Promise<WebHookInfo>

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotonevent-listener
    on: (event: string, listener: Listener) => void

    onText: (matcher: string | RegExp, callback: OnTextCallback) => void

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotprocessupdateupdate
    processUpdate: (update: Update) => void

    // https://core.telegram.org/bots/api#senddice
    sendDice: (chatId: ChatId, options: DiceOptions) => Promise<void>

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotsenddocumentchatid-doc-options-fileoptions--promise
    sendDocument: (
      chatId: ChatId,
      doc: string | stream.Stream | Buffer,
      options?: any,
      fileOptions?: any
    ) => Promise<void>

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotsendgamechatid-gameshortname-options--promise
    sendGame: (chatId: ChatId, gameName: string) => Promise<void>

    // https://core.telegram.org/bots/api#sendmessage
    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#TelegramBot+sendMessage
    sendMessage: (
      chatId: ChatId,
      message: string,
      options?: SendMessageOptions
    ) => Promise<void>

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotsendphotochatid-photo-options-fileoptions--promise
    sendPhoto: (
      chatId: ChatId,
      photo: string | stream.Stream | Buffer,
      options?: any,
      fileOptions?: any
    ) => Promise<void>

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotsetmycommandscommands-options--promise
    setMyCommands: (commands: any[], options: any) => Promise<void>

    // https://github.com/yagop/node-telegram-bot-api/blob/e114682f2e4b6d65f1772b7b78d260faf3ad1f66/doc/api.md#telegrambotsetwebhookurl-options-fileoptions--promise
    setWebHook: (url: string, options?: SetWebHookOptions) => Promise<void>
  }

  export default TelegramBot
}
