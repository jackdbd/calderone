import { http } from '@google-cloud/functions-framework'
import { makeLog } from '@jackdbd/tags-logger'
import { GoogleAuth } from 'google-auth-library'
// import phin from 'phin'

if (!process.env.NODE_ENV) {
  throw new Error('environment variable NODE_ENV not set')
}

// if (!process.env.TELEGRAM) {
//   throw new Error('environment variable TELEGRAM not set')
// }

// TELEGRAM is a secret stored in Secret Manager. It's a JSON, so we parse it.
// const { chat_id, token } = JSON.parse(process.env.TELEGRAM)

// https://html-color.codes/
// https://css-tricks.com/css-ruleset-terminology/
const css_rulesets = [
  `code, p {
    font-size: 1.2em;
  }`
]

const style = `<style>${css_rulesets.join('')}</style>`

const failureIndexHtml = ({ message }) => {
  const head_fragments = [
    `<title>URL not authorized</title>`,
    `<meta charset="utf-8">`,
    `<link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css">`,
    style
  ]

  const head = `<head>${head_fragments.join('')}</head>`

  return `
  <!DOCTYPE html>
  ${head}
  <body>
    <header>
      <h1>URL not authorized</h1>
    </header>
    <main>
      <p>${message}</p>
    </main>
    <footer>
      <p>CSS with <a href="https://andybrewer.github.io/mvp/" target="_blank">MVP.css</a></p>
    </footer>
  </body>
  </html>`
}

const successIndexHtml = ({ url, workflow_id, location, execution_id }) => {
  const head_fragments = [
    `<title>URL authorized</title>`,
    `<meta charset="utf-8">`,
    `<link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css">`,
    style
  ]

  const head = `<head>${head_fragments.join('')}</head>`

  return `
  <!DOCTYPE html>
  ${head}
  <body>
    <header>
      <h1>URL authorized</h1>
    </header>
    <main>
      <p>The URL <code>${url}</code> was authorized.</p>
      <p>Workflow ID <b>${workflow_id}</b></p>
      <p>Workflow location <b>${location}</b></p>
      <p>Execution ID <b>${execution_id}</b></p>
    </main>
    <footer>
      <p>CSS with <a href="https://andybrewer.github.io/mvp/" target="_blank">MVP.css</a></p>
    </footer>
  </body>
  </html>`
}

const log = makeLog({
  // structured logging (JSON) in production, unstructured logging in development.
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `human-in-the-loop-authorizer`
})

let auth = undefined
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  auth = new GoogleAuth({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
  })
  log({
    message: `Google Auth initialized with Google Application Credentials ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    tags: ['debug', 'authorization']
  })
} else {
  auth = new GoogleAuth()
  log({
    message:
      'Google Auth initialized with Application Default Credentials (ADC)',
    tags: ['debug', 'authorization']
  })
}

let client = undefined

http('authorizeCallbackUrl', async (req, res) => {
  // TODO: use zod/joi for validation
  if (!req.query.callback_url) {
    // res.status(400).send({ message: '`callback_url` not set in query string' })
    res
      .status(400)
      .send(
        failureIndexHtml({ message: '`callback_url` not set in query string' })
      )
    return
  }

  if (!req.query.workflow_id) {
    // res.status(400).send({ message: '`workflow_id` not set in query string' })
    res
      .status(400)
      .send(
        failureIndexHtml({ message: '`workflow_id` not set in query string' })
      )
    return
  }

  if (!req.query.location) {
    // res.status(400).send({ message: '`location` not set in query string' })
    res
      .status(400)
      .send(failureIndexHtml({ message: '`location` not set in query string' }))
    return
  }

  if (!req.query.execution_id) {
    // res.status(400).send({ message: '`execution_id` not set in query string' })
    res
      .status(400)
      .send(
        failureIndexHtml({ message: '`execution_id` not set in query string' })
      )
    return
  }

  const { callback_url: url, workflow_id, location, execution_id } = req.query

  if (!client) {
    try {
      client = await auth.getClient()
    } catch (err) {
      const message = `Error getting auth client: ${err.message}`
      log({ message, tags: ['error', 'authorization'] })
      // https://stackoverflow.com/questions/3297048/403-forbidden-vs-401-unauthorized-http-responses/6937030#6937030
      // res.status(401).send({ message })
      res.status(401).send(failureIndexHtml({ message }))
      return
    }
  }

  // I configured the workflow callback endpoint to wait for a GET request
  try {
    await client.request({ url, method: 'GET' })
  } catch (err) {
    const message = `Error authorizing URL ${url}: ${err.message}`
    log({ message, tags: ['error', 'authorization'] })
    // res.status(403).send({ message })
    res.status(403).send(failureIndexHtml({ message }))
    return
  }

  res
    .status(200)
    .send(successIndexHtml({ url, workflow_id, location, execution_id }))
  return
})
