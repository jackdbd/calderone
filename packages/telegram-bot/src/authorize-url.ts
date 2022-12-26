import type { Context } from 'telegraf'
import type { MessageEntity, Update } from 'telegraf/types'
import type { Firestore } from '@google-cloud/firestore'
import { docResultsWithData } from '@jackdbd/firestore-utils'
import type { DocResultData } from '@jackdbd/firestore-utils'
import type { Compute, GoogleAuth } from 'google-auth-library'
import type { JSONClient } from 'google-auth-library/build/src/auth/googleauth.js'
import { makeLog } from '@jackdbd/tags-logger'
import { APP_ID } from './constants.js'
import { appendUpdatesToOriginalMessage } from './utils.js'

const log = makeLog({
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `${APP_ID}:authorize-url`
})

interface Config {
  approved: boolean
  ctx: Context<Update>
  firestore: Firestore
  firestore_collection: string
  google_auth: GoogleAuth
}

// TODO: create at least 2 functions (retrieve URL, approve URL, reject URL)

export const retrieveUrlFromFirestoreAndAuthorizeIt = async ({
  approved,
  ctx,
  firestore,
  firestore_collection,
  google_auth
}: Config) => {
  await ctx.answerCbQuery(
    `Retrieving data from Firestore collection ${firestore_collection}...`
  )

  const ref = firestore.collection(firestore_collection)

  // Firestore queries limitations:
  // - only a single 'NOT_EQUAL', 'NOT_IN', 'IS_NOT_NAN', or 'IS_NOT_NULL'
  // -inequality filter property and first sort order must be the same
  const query = ref
    // .where('url', '!=', null)
    .orderBy('unix_timestamp_utc', 'desc')
  // .orderBy('telegram_message_id', 'desc')

  let text = ''
  if (ctx.callbackQuery.message && (ctx.callbackQuery.message as any).text) {
    text = (ctx.callbackQuery.message as any).text
  }

  let entities = [] as MessageEntity[]
  if (
    ctx.callbackQuery.message &&
    (ctx.callbackQuery.message as any).entities
  ) {
    entities = (ctx.callbackQuery.message as any).entities
  }

  const updates = [] as string[]

  let doc_results = [] as DocResultData<{
    url: string
    method: 'GET' | 'POST'
  }>[]

  try {
    doc_results = await docResultsWithData({ limit: 1, query })
  } catch (err: any) {
    const message = `Could not retrieve Firestore docs from ${firestore_collection}: ${err.message}`
    log({ message, tags: ['error', 'firestore'] })
    updates.push(message)
    await appendUpdatesToOriginalMessage({ ctx, entities, text, updates })
    return
  }

  if (doc_results.length === 0) {
    const message = `Retrieved no Firestore docs from collection ${firestore_collection}`
    log({ message, tags: ['debug', 'firestore'] })
    updates.push(message)
    await appendUpdatesToOriginalMessage({ ctx, entities, text, updates })
    return
  }

  const doc = doc_results[0]
  const doc_id = doc.doc_id
  // The last part of the Firestore document ID is the Workflows execution ID.
  // See documents.patch in human-in-the-loop workflow.
  //   const execution_id = doc.doc_id
  const url = doc.data.url
  const method = doc_results[0].data.method

  const message = `Retrieved Firestore doc ${firestore_collection}/${doc_id}`
  log({ message, tags: ['debug', 'firestore'] })
  updates.push(message)

  let auth_client: JSONClient | Compute
  try {
    auth_client = await google_auth.getClient()
    updates.push(`Initialized OAuth 2.0 client`)
  } catch (err: any) {
    const message = `Could not initialize OAuth 2.0 client: ${err.message}`
    log({ message, tags: ['error', 'authorization'] })
    updates.push(message)
    await appendUpdatesToOriginalMessage({ ctx, entities, text, updates })
    return
  }

  try {
    // For Telegram buttons of type callback_data, I can send either a POST
    // (with a body) or a GET (with a query string).
    // For Telegram buttons of type URL, I can only send a GET.
    const body = JSON.stringify({ approved })
    // await auth_client.request({ url: `${url}?approved=${approved}`, method })
    await auth_client.request({ url, method, body })
    const message = `Made authorized ${method} ${url} using OAuth 2.0 client`
    log({ message, tags: ['debug', 'authorization'], method, body })
    updates.push(message)
  } catch (err: any) {
    const message = `Could not authorize ${method} ${url}: ${err.message}`
    log({ message, tags: ['error', 'authorization'] })
    updates.push(message)
    await appendUpdatesToOriginalMessage({ ctx, entities, text, updates })
    return
  }

  try {
    await firestore.doc(`${firestore_collection}/${doc_id}`).delete()
    const message = `Deleted Firestore doc ${firestore_collection}/${doc_id}`
    log({ message, tags: ['debug', 'firestore'] })
    updates.push(message)
  } catch (err: any) {
    const message = `Could not delete ${firestore_collection}/${doc_id}: ${err.message}`
    log({ message, tags: ['error', 'firestore'] })
    updates.push(message)
  } finally {
    await appendUpdatesToOriginalMessage({ ctx, entities, text, updates })
  }
}
