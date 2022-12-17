import type { Context } from 'telegraf'
import type { Update } from 'telegraf/types'
import { makeLog } from '@jackdbd/tags-logger'
import { APP_ID } from './constants.js'

const log = makeLog({
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:middlewares`
})

type Next = () => Promise<void>

export const logProcessingTime = async (ctx: Context<Update>, next: Next) => {
  log({
    message: `log processing time middleware`,
    tags: ['debug', 'middleware']
  })
  console.time(`Processing update ${ctx.update.update_id}`)

  // runs next middleware
  await next()

  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`)
}

interface CtxWithFoo extends Context<Update> {
  foo: Record<string, unknown>
}

export const addFooToCtx = async (ctx: CtxWithFoo, next: Next) => {
  log({
    message: `add foo to ctx middleware`,
    tags: ['debug', 'middleware']
  })

  ctx.foo = { answer: 42, bar: 'baz' }

  await next()
}
