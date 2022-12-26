import type { Context } from 'telegraf'
import type { MessageEntity, Update } from 'telegraf/types'
import { makeLog } from '@jackdbd/tags-logger'
import { APP_ID, EMOJI } from './constants.js'

const log = makeLog({
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:utils`
})

interface ConfigAppendUpdates {
  ctx: Context<Update>
  entities: MessageEntity[]
  text: string
  updates: string[]
}

export const appendUpdatesToOriginalMessage = async (
  config: ConfigAppendUpdates
) => {
  const {
    ctx,
    entities: original_enties,
    text: original_text,
    updates
  } = config
  // entities must be specified INSTEAD of parse_mode.
  // https://core.telegram.org/bots/api#editmessagetext

  // this does not seem to work
  // const s = updates.map((u) => u.padStart(u.length + 2, '• ')).join('\n')

  let text = original_text.concat('\n\n')

  const s_updates = 'Updates'
  const entities: MessageEntity[] = [
    ...original_enties,
    { type: 'bold', offset: text.length, length: s_updates.length }
  ]
  text = text.concat(s_updates)

  const s = updates
    .map((u, i) => u.padStart(u.length + `${i + 1}. `.length, `${i + 1}. `))
    .join('\n')

  await ctx.editMessageText(`${text}\n${s}`, {
    disable_web_page_preview: true,
    entities
  })
}

interface ConfigExecutionError {
  ctx: Context<Update>
  error: Error
  workflow: string
}

export const replyWithExecutionError = async ({
  ctx,
  error,
  workflow
}: ConfigExecutionError) => {
  const error_name = error.name || 'Error'

  const lines = [
    `${EMOJI.error} <b>Workflow ${workflow} errored</b>`,
    `\n\n`,
    `${error_name}:`,
    `\n`,
    `<pre><code>${error.message}</code></pre>`
  ]

  await ctx.replyWithHTML(lines.join(''))
}
