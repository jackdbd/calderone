import { http } from '@google-cloud/functions-framework'
import { bulkDelete, docResultsWithData } from '@jackdbd/firestore-utils'
import { Telegraf, Markup } from 'telegraf'
import { callbackQuery, message } from 'telegraf/filters'
import { makeLog } from '@jackdbd/tags-logger'
import { retrieveUrlFromFirestoreAndAuthorizeIt } from './authorize-url.js'
import { clients } from './clients.js'
import { APP_ID, EMOJI } from './constants.js'
import { logProcessingTime, addFooToCtx, logCtxUpdate } from './middlewares.js'
import { replyWithExecutionError } from './utils.js'
import { createExecutionAndWaitForResult } from './workflows-utils.js'

// is there an environment variable for this?
const PROJECT_ID = 'prj-kitchen-sink'

const { executions, firestore, google_auth } = clients({
  projectId: PROJECT_ID
})

const log = makeLog({
  // structured logging (JSON) in production, unstructured logging in development.
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:main`
})

if (!process.env.FIRESTORE_COLLECTION) {
  throw new Error('environment variable FIRESTORE_COLLECTION not set')
}
const FIRESTORE_COLLECTION = process.env.FIRESTORE_COLLECTION

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

const bot = new Telegraf(token)

bot.use(logProcessingTime)
bot.use(addFooToCtx)
bot.use(logCtxUpdate)

bot.catch(async (err: any, ctx) => {
  log({
    message: `Telegram bot ${ctx.botInfo.username} encountered an error when processing update id ${ctx.update.update_id} (update type ${ctx.updateType}): ${err.message}`,
    tags: ['error', 'catch'],
    botInfo: ctx.botInfo,
    chat: ctx.chat,
    from: ctx.from
  })

  const lines = [
    `Telegram bot <code>${ctx.botInfo.username}</code> encountered an error when processing update id <code>${ctx.update.update_id}</code> (update type <code>${ctx.updateType}</code>)`,
    `\n\n`,
    `<pre><code>${err.message}</code></pre>`
  ]
  await ctx.replyWithHTML(
    `${EMOJI.alert} <b>Bot error</b>\n\n${lines.join('')}`
  )
})

const waitMs = (ms: number): Promise<{ message: string }> => {
  let timeout: NodeJS.Timeout
  return new Promise((resolve) => {
    timeout = setTimeout(() => {
      clearTimeout(timeout)
      resolve({ message: `timeout ${timeout} of ${ms}ms resolved` })
    }, ms)
  })
}

bot.hears(/ciccio pasticcio/i, async (ctx) => {
  await ctx.replyWithHTML(
    `<b>Did you say Ciccio Pasticcio?</b>\n\nThis is what you wrote:\n<pre>${ctx.match.input}</pre>`
  )
})

// sends a thumbs up sticker when it receives any sticker
bot.on(message('sticker'), async (ctx) => {
  await ctx.reply('👍')
})

bot.command('cocktail', async (ctx) => {
  const workflow = 'random-cocktail'
  const location = 'europe-west4'

  const { error } = await createExecutionAndWaitForResult({
    client: executions,
    project: PROJECT_ID,
    location,
    workflow
  })

  if (error) {
    await replyWithExecutionError({ ctx, error, workflow })
  }
})

bot.command('hacker_news', async (ctx) => {
  const workflow = 'hacker-news'
  const location = 'europe-west4'

  const { error } = await createExecutionAndWaitForResult({
    client: executions,
    project: PROJECT_ID,
    location,
    workflow
  })

  if (error) {
    await replyWithExecutionError({ ctx, error, workflow })
  }
})

bot.command('random', async (ctx) => {
  const text = 'Dr Pepper'
  const callback_data = 'drink_dr_pepper'
  const hide = Math.random() > 0.5

  await ctx.sendMessage(`<b>What's your favorite drink?</b>`)
  const ms = 3000
  // https://core.telegram.org/bots/api#sendchataction
  await ctx.reply(`simulating an operation that takes ${ms}ms`)
  await ctx.sendChatAction('typing')
  await waitMs(ms)

  await ctx.reply(
    'random example',
    Markup.inlineKeyboard([
      Markup.button.callback('Drink Coke', 'Coke', hide),
      Markup.button.callback(text, callback_data),
      Markup.button.callback('Drink Pepsi', 'Pepsi', hide)
    ])
  )
})

bot.action('drink_dr_pepper', async (ctx) => {
  await ctx.reply('You clicked Dr Pepper')
  return
})

// the first portion of the regex is a Firestore document ID
bot.action(/.+__abort/i, async (ctx) => {
  await retrieveUrlFromFirestoreAndAuthorizeIt({
    approved: false,
    ctx,
    firestore,
    firestore_collection: FIRESTORE_COLLECTION,
    google_auth
  })
})

// the first portion of the regex is a Firestore document ID
bot.action(/.+__authorize/i, async (ctx) => {
  await retrieveUrlFromFirestoreAndAuthorizeIt({
    approved: true,
    ctx,
    firestore,
    firestore_collection: FIRESTORE_COLLECTION,
    google_auth
  })
})

bot.command('sendgif', async (ctx) => {
  // https://github.com/yagop/node-telegram-bot-api/blob/master/doc/help.md#gifs
  await ctx.sendDocument(
    'https://media.giphy.com/media/DkS54Mk7d2VlD0ilKu/giphy.gif',
    { caption: 'This is a test GIF' }
  )
})

bot.command('sendpic', async (ctx) => {
  await ctx.sendPhoto(
    {
      url: 'https://thumbs.dreamstime.com/b/demo-rubber-stamp-grunge-design-dust-scratches-effects-can-be-easily-removed-clean-crisp-look-color-easily-changed-82616276.jpg'
    },
    { caption: 'Here we go! \nThis is just a caption' }
  )
})

bot.command('firestore_bulk_delete', async (ctx) => {
  const ref = firestore.collection(FIRESTORE_COLLECTION)
  const query = ref.where('url', '!=', null)

  const { doc_ids } = await bulkDelete({ query })

  const lines = [
    `${EMOJI.firestore} <b>Bulk delete Firestore documents</b>`,
    '\n\n',
    `${doc_ids.deleted.length} documents deleted`,
    '\n',
    doc_ids.deleted.join('\n'),
    '\n\n',
    `${doc_ids.skipped.length} documents skipped`,
    '\n',
    doc_ids.skipped.join('\n')
  ]
  await ctx.replyWithHTML(lines.join(''))
})

bot.command('firestore_list', async (ctx) => {
  const collection = FIRESTORE_COLLECTION
  const ref = firestore.collection(collection)
  // Firestore queries limitations:
  // - only a single 'NOT_EQUAL', 'NOT_IN', 'IS_NOT_NAN', or 'IS_NOT_NULL'
  // -inequality filter property and first sort order must be the same
  const query = ref
    // .where('url', '!=', null)
    .orderBy('unix_timestamp_utc', 'desc')

  const limit = 10

  const doc_results = await docResultsWithData<{
    url: string
    method: 'GET' | 'POST'
  }>({
    limit,
    query
  })

  if (doc_results.length === 0) {
    const lines = [
      `${EMOJI.firestore} <b>Docs in Firestore collection ${collection}</b>`,
      '\n\n',
      `No documents`
    ]
    await ctx.replyWithHTML(lines.join(''))
  } else {
    const docs = doc_results.map(({ doc_id, data }) => {
      return `Doc ID <code>${doc_id}</code>\n<pre><code>${JSON.stringify(
        data,
        null,
        2
      )}</code></pre>`
    })
    const lines = [
      `${EMOJI.firestore} <b>Docs in Firestore collection ${collection}</b>`,
      '\n\n',
      `${doc_results.length} documents (limit ${limit}).`,
      '\n\n',
      docs.reduce((acc, cv) => `${acc}${cv}\n\n`, '')
    ]
    await ctx.replyWithHTML(lines.join(''))
  }
})

// bot.action(/.+/, (ctx) => {
//   return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
// })

bot.on(callbackQuery('data'), async (ctx) => {
  const lines = [
    `${EMOJI.warning} <b>Callback Query catch all</b>`,
    `\n\n`,
    `Received callback query id <code>${ctx.callbackQuery.id}</code>, whose callback_data is not handled by any bot action.`,
    `\n\n`,
    `Callback data`,
    `\n`,
    `<pre><code>${ctx.callbackQuery.data}</code></pre>`
  ]
  await ctx.replyWithHTML(lines.join(''))
})

// Both in development and in production, the HTTP server is the one created by
// the GCP functions-framework. This means we can't use bot.launch(), because it
// would create a new HTTP server. Instead, we use bot.createWebhook() to attach
// Telegraf to the existing HTTP server.

const handler = await bot.createWebhook({
  // Update objects that this webhook is allowed to receive from the Telegram
  // Bot API. The list of available Update objects can be found here:
  // https://core.telegram.org/bots/api#update
  allowed_updates: [
    'callback_query',
    'channel_post',
    'chat_join_request',
    'chat_member',
    'chosen_inline_result',
    'edited_channel_post',
    'edited_message',
    'inline_query',
    'message',
    'my_chat_member',
    'poll',
    'poll_answer',
    'pre_checkout_query',
    'shipping_query',
    'update_id'
  ],

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

// bot.hears() looks on messages (ctx.message.text)
// A keyboard returns no messages. When the user hits a button it returns a
// callbackQuery with data. bot.action checks this data (ctx.callbackQuery.data)
// https://github.com/telegraf/telegraf/issues/978

// bot.hears(/foobar/, async (ctx) => {
//   await ctx.reply('I heared Foobar')
// })

http('telegramBot', handler)

// TODO: should I try to exit gracefully if I deploy the bot on GCP
// Cloud Functions 2nd gen? Probably not...
// https://cloud.google.com/blog/topics/developers-practitioners/graceful-shutdowns-cloud-run-deep-dive
// https://stackoverflow.com/questions/55686889/best-practice-stop-cloud-function
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))
