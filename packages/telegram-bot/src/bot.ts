import makeDebug from 'debug'
import { ExecutionsClient } from '@google-cloud/workflows'
import TelegramBot from 'node-telegram-bot-api'
import { callWorkflowsAPI } from './workflows-utils.js'

const debug = makeDebug('telegram-bot/bot')

interface Config {
  project_id: string
  token: string
}

export const makeBot = ({ project_id, token }: Config) => {
  const client = new ExecutionsClient()

  const bot = new TelegramBot(token, { webHook: true })

  // bot.on('message', (message) => {
  //   const { chat, message_id, text } = message
  //   const username = message.from.username
  //   debuglog(`got message ${message_id} from ${username} in chat ${chat.id}`)
  //   bot.sendMessage(chat.id, `got text: ${text} from username: ${username}`)
  // })

  bot.onText(/\/cocktail/, async ({ chat }: any) => {
    const workflow = 'random-cocktail-to-telegram'
    const { success, result } = await callWorkflowsAPI({
      client,
      project: project_id,
      location: 'europe-west4',
      workflow
    })
    if (success) {
      const obj = JSON.parse(result!)
      const cocktail = obj.message as string
      bot.sendMessage(chat.id, cocktail)
    } else {
      bot.sendMessage(chat.id, `GCP workflow ${workflow} failed`)
    }
  })

  bot.onText(/\/dice/, async ({ chat }: any) => {
    // https://python-telegram-bot.readthedocs.io/en/stable/telegram.dice.html
    const emoji = '🎲'
    // const emoji = '🎯'
    // const emoji = '🏀'
    // const emoji = '⚽'
    // const emoji = '🎳'
    await bot.sendDice(chat.id, { emoji })
  })

  bot.onText(/\/sendpic/, ({ chat }: any) => {
    debug(`sendpic to chat id ${chat.id}`)
    bot.sendPhoto(
      chat.id,
      'https://thumbs.dreamstime.com/b/demo-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-changed-82616276.jpg',
      {
        caption: 'Here we go! \nThis is just a caption'
      }
    )
  })

  bot.onText(/\/sendgif/, ({ chat }: any) => {
    debug(`sendgif to chat id ${chat.id}`)
    // https://github.com/yagop/node-telegram-bot-api/blob/master/doc/help.md#gifs
    bot.sendDocument(
      chat.id,
      'https://media.giphy.com/media/DkS54Mk7d2VlD0ilKu/giphy.gif'
    )
  })

  return bot
}
