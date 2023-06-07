import { http } from '@google-cloud/functions-framework'
import { makeLog } from '@jackdbd/tags-logger'
import { BigQuery } from '@google-cloud/bigquery'
import { send } from '@jackdbd/notifications/telegram'

const FUNCTION_NAME = 'runQueryOnCrUX'

if (process.env.NODE_ENV !== 'production') {
  throw new Error(
    'environment variable NODE_ENV should always be set to production. See https://youtu.be/FFAWp9qoX4M'
  )
}

if (!process.env.TELEGRAM) {
  throw new Error('environment variable TELEGRAM not set')
}
// TELEGRAM is a secret stored in Secret Manager. It's a JSON, so we parse it.
const { chat_id, token } = JSON.parse(process.env.TELEGRAM)

if (!process.env.WEBPAGETEST) {
  throw new Error('environment variable WEBPAGETEST not set')
}
// WEBPAGETEST is a secret stored in Secret Manager. It's a JSON, so we parse it.
const { api_key: wpt_api_key } = JSON.parse(process.env.WEBPAGETEST)

const log = makeLog({
  // Use structured logging (JSON) in production, and unstructured logging in
  // development.
  // K_SERVICE is one of the several environment variables available at runtime
  // in a Cloud Functions 2nd gen application.
  // https://cloud.google.com/functions/docs/configuring/env-var#newer_runtimes
  namespace: process.env.K_SERVICE ? undefined : `cloud-function`
})

const parameterizedQuery = ({ year = undefined, month = undefined } = {}) => {
  const gcp_project_id = 'chrome-ux-report'
  const dataset_id = 'materialized'
  const table_id = 'country_summary'

  const d = new Date()

  let yyyy
  if (year) {
    yyyy = year
  } else {
    yyyy = d.getFullYear()
  }

  let mm
  if (month) {
    mm = month
  } else {
    // The table of the BigQuery CrUX dataset of this month, or the previous month,
    // could still be unavailable, so we take the table of 2 months ago.
    // FIXME: doesn't work with the first month of the year
    mm = d.getMonth() - 1
    mm = `${mm}`.padStart(2, '0')
  }

  const yyyymm = `${yyyy}${mm}`

  return `
#standardSQL
SELECT
  origin,
  device AS visited_most_on,
  ROUND(SAFE_MULTIPLY(phoneDensity, 100), 2) AS percent_phone,
  ROUND(SAFE_MULTIPLY(tabletDensity, 100), 2) AS percent_tablet,
  ROUND(SAFE_MULTIPLY(desktopDensity, 100), 2) AS percent_desktop,
  ROUND(SAFE_MULTIPLY(_3GDensity, 100), 2) AS percent_3G,
  ROUND(SAFE_MULTIPLY(_4GDensity, 100), 2) AS percent_4G,

  -- Time To First Byte
  ROUND(SAFE_MULTIPLY(slow_ttfb, 100), 2) AS ttfb_bad,
  ROUND(SAFE_MULTIPLY(avg_ttfb, 100), 2) AS ttfb_avg,
  ROUND(SAFE_MULTIPLY(fast_ttfb, 100), 2) AS ttfb_good,
  p75_ttfb AS ttfb_ms_p75,

  -- DOM Content Loaded
  p75_dcl AS dom_content_loaded_ms_p75,

  -- load event
  p75_ol AS load_event_ms_p75
FROM
  ${gcp_project_id}.${dataset_id}.${table_id}
WHERE
  UPPER(country_code) = @country_code
  AND rank <= 1000
  AND slow_ttfb > @slow_ttfb
  AND yyyymm = ${yyyymm}
ORDER BY
  slow_ttfb DESC
LIMIT @limit;`
}

// https://andybrewer.github.io/mvp/
const LINK_MVP_CSS =
  '<link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css">'

// https://html-color.codes/
// https://css-tricks.com/css-ruleset-terminology/
const CSS_RULESETS = [
  `code, p {
    font-size: 1.2em;
  }`
]

const STYLE = `<style>${CSS_RULESETS.join('')}</style>`

const successIndexHtml = ({ options }) => {
  const { query, params, ...rest } = options

  const title = `SQL query to run against CrUX`

  const head_fragments = [
    `<title>${title}</title>`,
    `<meta charset="utf-8">`,
    `${LINK_MVP_CSS}`,
    STYLE
  ]

  return `
  <!DOCTYPE html>
  <head>${head_fragments.join('')}</head>
  <body>
    <header>
      <h1>${title}</h1>
    </header>
    <main>
      <p>A POST request will run this parameterized query on BigQuery:</p>
      <pre><code>${query}</code></pre>
      <p>Here are the query parameters:</p>
      <pre><code>${JSON.stringify(params, null, 2)}</code></pre>
      <p>Other options for the BigQuery client:</p>
      <pre><code>${JSON.stringify(rest, null, 2)}</code></pre>
    </main>
    <footer>
      <p>CSS with <a href="https://andybrewer.github.io/mvp/" target="_blank">MVP.css</a></p>
    </footer>
  </body>
  </html>`
}

const row2str = (row) => {
  const { origin, ...rest } = row

  const pingback = `https://webhooks.giacomodebidda.com/webpagetest`
  const wpt_url = `https://www.webpagetest.org/runtest.php?url=${origin}/&k=${wpt_api_key}&f=json&pingback=${pingback}`

  let s = `<b>URL</b> <a href="${origin}">${origin}</a>`

  s = s.concat('\n')
  s = s.concat(`<pre><code>${JSON.stringify(rest, null, 2)}</code></pre>`)

  s = s.concat('\n')
  s = s.concat(
    `<b>Audit</b> <a href="${wpt_url}">Click to test with WebPageTest</a>`
  )
  s = s.concat('\n')
  s = s.concat(
    `TODO: add several links to audit the URL on mobile, desktop, etc`
  )
  return s
}

const textFromRows = ({
  country_code,
  slow_ttfb,
  rows,
  i_batch,
  tot_batches
}) => {
  const title = `Query on CrUX dataset (batch ${i_batch + 1}/${tot_batches})`
  let text = `⚡ <b>${title}</b>`

  text = text.concat('\n\n')
  text = text.concat(
    `Origins with bad TTFB in country <code>${country_code}</code>.`
  )
  text = text.concat(' ')
  text = text.concat(
    `At least ${slow_ttfb * 100}% of users experienced a bad TTFB.`
  )

  text = text.concat('\n\n')
  text = text.concat(rows.map(row2str).join('\n\n'))

  text = text.concat('\n\n')
  text = text.concat(`<i>Sent by <code>${FUNCTION_NAME}</code></i>`)

  return text
}

const messagesPromise = async ({ chat_id, token, text }) => {
  const messages = []
  try {
    const result = await send(
      {
        chat_id,
        token,
        text
      },
      { disable_notification: false, disable_web_page_preview: true }
    )
    if (result.delivered) {
      messages.push(`message delivered to Telegram chat ${chat_id}`)
    } else {
      messages.push(
        `could not deliver message to chat ${chat_id}: ${result.message}`
      )
    }
  } catch (err) {
    const message = `could not send message to Telegram chat ${chat_id}`
    messages.push(message)
    log({
      message: `${message} (see JSON payload)`,
      original_error_message: err.message,
      text,
      tags: ['warning', 'telegram']
    })
  } finally {
    return messages
  }
}

const textsInBatches = async ({ bq, options, batch_size = 3 }) => {
  const { country_code, slow_ttfb } = options.params

  const texts = []
  try {
    const [rows] = await bq.query(options)

    const batches = []
    let i_batch = -1
    for (const [i, row] of Object.entries(rows)) {
      if (i % batch_size === 0) {
        const batch = [row]
        batches.push(batch)
        i_batch++
        log({
          message: `new batch with i=${i}`,
          batch,
          i_batch,
          tags: ['debug', 'batch']
        })
      } else {
        batches[i_batch].push(row)
        log({
          message: `add i=${i} to batch ${i_batch}`,
          batch: batches[i_batch],
          i_batch,
          tags: ['debug', 'batch']
        })
      }
    }

    batches.forEach((batch_rows, i_batch) => {
      texts.push(
        textFromRows({
          country_code,
          slow_ttfb,
          rows: batch_rows,
          i_batch,
          tot_batches: batches.length
        })
      )
    })
  } catch (err) {
    let text = '⚡ <b>Query on CrUX BigQuery dataset</b>'
    text = text.concat('\n\n')
    text = text.concat(`<b>${err.name}</b>` || '<b>Error</b>')
    text = text.concat(
      `<pre><code>${err.message}</code></pre>` ||
        '<pre><code>Error had no message</code></pre>'
    )
    text = text.concat('\n\n')
    text = text.concat(`<i>Sent by <code>${FUNCTION_NAME}</code></i>`)
    texts.push(text)
  }

  return texts
}

let bq = undefined

http(FUNCTION_NAME, async (req, res) => {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    bq = new BigQuery({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    })
    log({
      message: `Google BigQuery initialized with Google Application Credentials ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
      tags: ['debug', 'authorization', 'client']
    })
  } else {
    bq = new BigQuery()
    log({
      message:
        'Google BigQuery initialized with Application Default Credentials (ADC)',
      tags: ['debug', 'authorization', 'client']
    })
  }

  const country_code = req.query.country_code || req.body.country_code || 'IT'
  let slow_ttfb = req.query.slow_ttfb || req.body.slow_ttfb || '0.25'
  slow_ttfb = parseFloat(slow_ttfb)

  const sql = parameterizedQuery()
  const params = { country_code, limit: 15, slow_ttfb }

  const options = {
    // https://cloud.google.com/bigquery/docs/dry-run-queries#node.js
    // dryRun: true,
    query: sql,
    // Location must match that of the dataset(s) referenced in the query.
    // The CrUX BigQuery dataset is (only?) in the US.
    location: 'US',
    params,
    useQueryCache: true
  }

  // return res.send({
  //   message: `run parameterized query with these params (see payload)`,
  //   params
  // })

  switch (req.method) {
    case 'GET': {
      log({ message: `send HTML page`, tags: ['debug', 'html'] })

      return res
        .status(200)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(successIndexHtml({ options }))
    }
    case 'POST': {
      log({ message: `run CrUX query`, tags: ['debug', 'query', 'crux'] })

      const texts = await textsInBatches({ bq, options, batch_size: 3 })
      if (texts.length === 0) {
        log({
          message: `no results found in CrUX using this query`,
          tags: ['warning', 'query', 'crux']
        })
      }

      const all_messages = await Promise.all(
        texts.map(async (text, i) => {
          const messages = await messagesPromise({ chat_id, token, text: text })
          return `Batch ${i + 1}: ${messages.join('; ')}`
        })
      )

      return res
        .status(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: all_messages.join('. ') })
    }
    default: {
      log({
        message: `received ${req.method} request`,
        tags: ['debug', 'not-implemented']
      })

      return res
        .status(415)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Not implemented' })
    }
  }
})
