import { http } from '@google-cloud/functions-framework'
import { ExecutionsClient } from '@google-cloud/workflows'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { makeLog } from '@jackdbd/tags-logger'
import type { ParseMode } from 'telegraf/types'
import { APP_ID, EMOJI } from './constants.js'
import { logProcessingTime, addFooToCtx } from './middlewares.js'
import { callWorkflowsAPI } from './workflows-utils.js'

// is there an environment variable for this?
const PROJECT_ID = 'prj-kitchen-sink'

if (!process.env.TELEGRAM_BOT) {
  throw new Error('environment variable TELEGRAM_BOT not set')
}

const { url, token, webhook_secret } = JSON.parse(process.env.TELEGRAM_BOT)

// In production, the bot runs on Cloud Functions and the URL does not change.
// In development, the bot runs on my laptop and the URL changes every time,
// since it is assigned by ngrok.
const [_, domain] = process.env.TELEGRAM_BOT_URL
  ? process.env.TELEGRAM_BOT_URL.split('https://')
  : url.split('https://')

// In development I set the environment variable GOOGLE_APPLICATION_CREDENTIALS.
// In production it's not needed: all GCP clients will be instantiated with
// Application Default Credentials (ADC)
const client = new ExecutionsClient()

const log = makeLog({
  // structured logging (JSON) in production, unstructured logging in development.
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:main`
})

const SEND_MESSAGE_OPTIONS = {
  disable_notification: false,
  disable_web_page_preview: false,
  parse_mode: 'HTML' as ParseMode
}

const bot = new Telegraf(token)

bot.use(logProcessingTime)
bot.use(addFooToCtx)

bot.catch((err: any, ctx) => {
  log({
    message: `Telegram bot encountered an error for ${ctx.updateType}: ${err.message}`,
    tags: ['error', 'catch'],
    botInfo: ctx.botInfo,
    chat: ctx.chat,
    from: ctx.from
  })
})

bot.on(message('sticker'), async (ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} received update type ${ctx.updateType}`,
    tags: ['info', 'sticker']
  })

  await ctx.reply('👍')
})

bot.hears('hi', (ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} received update type ${ctx.updateType}`,
    tags: ['info', 'hi']
  })

  return ctx.sendMessage('<b>Hey there</b>', SEND_MESSAGE_OPTIONS)
})

bot.command('cocktail', async (ctx) => {
  const workflow = 'random-cocktail'
  const location = 'europe-west4'

  log({
    message: `${ctx.botInfo.username} calls GCP workflow ${workflow}`,
    tags: ['info', 'command', 'cocktail']
  })

  const { error, value } = await callWorkflowsAPI({
    client,
    project: PROJECT_ID,
    location,
    workflow
  })

  if (value) {
    const { text } = JSON.parse(value)
    await ctx.sendMessage(text, SEND_MESSAGE_OPTIONS)
  } else {
    await ctx.sendMessage(
      `${EMOJI.error} GCP workflow ${workflow} failed: ${error.message}`,
      SEND_MESSAGE_OPTIONS
    )
  }
})

bot.command('dice', async (ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} received update type ${ctx.updateType}`,
    tags: ['info', 'command', 'dice']
  })

  // https://python-telegram-bot.readthedocs.io/en/stable/telegram.dice.html
  const emoji = '🎲'
  // const emoji = '🎯'
  // const emoji = '🏀'
  // const emoji = '⚽'
  // const emoji = '🎳'

  await ctx.sendDice({ emoji })
})

bot.command('foo', async (ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} received update type ${ctx.updateType}`,
    tags: ['info', 'command', 'foo']
  })

  await ctx.sendMessage(
    `${EMOJI.notice} Got <b>foo</b> <i>command</i>`,
    SEND_MESSAGE_OPTIONS
  )
})

bot.command('oldschool', async (ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} received update type ${ctx.updateType}`,
    tags: ['info', 'command', 'oldschool']
  })

  await ctx.sendMessage(
    'Got <b>oldschool</b> <i>command</i>',
    SEND_MESSAGE_OPTIONS
  )
})

bot.command('sendpic', async (ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} received update type ${ctx.updateType}`,
    tags: ['info', 'command', 'sendpic']
  })

  await ctx.sendPhoto(
    {
      url: 'https://thumbs.dreamstime.com/b/demo-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-changed-82616276.jpg'
    },
    { caption: 'Here we go! \nThis is just a caption' }
  )
})

bot.command('sendgif', async (ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} received update type ${ctx.updateType}`,
    tags: ['info', 'command', 'sendgif']
  })

  // https://github.com/yagop/node-telegram-bot-api/blob/master/doc/help.md#gifs
  await ctx.sendDocument(
    'https://media.giphy.com/media/DkS54Mk7d2VlD0ilKu/giphy.gif',
    { caption: 'This is a test GIF' }
  )
})

// Both in development and in production, the HTTP server is the one creaed by
// the GCP functions-framework. This means we can't use bot.launch(), because it
// would create a new HTTP server. Instead, we use bot.createWebhook() to attach
// Telegraf to the existing HTTP server.

const handler = await bot.createWebhook({
  // Update objects that this webhook is allowed to receive from the Telegram
  // Bot API. The list of available Update objects can be found here:
  // https://core.telegram.org/bots/api#update
  allowed_updates: ['message', 'channel_post'],

  // Domain where the webhook is hosted:
  // - in development, it's the ngrok Forwarding URL without https://
  // - in production, it's the Cloud Functions trigger URL without https://
  domain,

  // drop_pending_updates: true,

  // max_connections: 40,

  // In addition to using a webhook secret, a Telegram bot can be made more
  // secure by accepting only POST requests coming from IP addresses that belong
  // to known Telegram servers. These IPs should be 149.154.160.0 and 91.108.4.0
  // https://core.telegram.org/bots/webhooks#the-short-version
  // ip_address: '',

  path: '/telegraf',

  // Expected value for the HTTP request header X-Telegram-Bot-Api-Secret-Token.
  // If incoming requests lack this header or have a different value for the
  // secret, Telegraf automatically blocks them and returns a HTTP 403.
  secret_token: webhook_secret
})

http('telegramBot', handler)

// TODO: should I try to exit gracefully if I deploy the bot on GCP
// Cloud Functions 2nd gen? Probably not...
// https://cloud.google.com/blog/topics/developers-practitioners/graceful-shutdowns-cloud-run-deep-dive
// https://stackoverflow.com/questions/55686889/best-practice-stop-cloud-function
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))
