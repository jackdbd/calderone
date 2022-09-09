import Joi from 'joi'

const TAG = 'telegram'

export interface Credentials {
  chat_id: string
  token: string
}

export const chat_id = Joi.alternatives()
  .try(Joi.number(), Joi.string().min(1))
  .description('Telegram chat id')
  .tag(TAG)

export const token = Joi.string()
  .min(1)
  .description('Telegram bot token')
  .tag(TAG)

export const credentials = Joi.object<Credentials>()
  .keys({
    chat_id: chat_id.required(),
    token: token.required()
  })
  .description('Telegram chat id + bot token')
  .tag(TAG)

// https://core.telegram.org/bots/api#sendmessage
export const text = Joi.string()
  .min(1)
  .max(4096)
  .description('text message for a Telegram chat')
  .tag(TAG)
  .note(
    'The Telegram sendMessage API allows text messages of 1-4096 characters after entities parsing'
  )
