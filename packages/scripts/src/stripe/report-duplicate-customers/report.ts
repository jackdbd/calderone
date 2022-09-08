import type { ReportData } from './data.js'

export interface Config {
  data: ReportData
  livemode: boolean
}

export interface Report {
  html: string
  text: string
}

export const report = (config: Config): Report => {
  const { data, livemode } = config
  const { customers_by_email, query, n_total, ts_ms_begin, ts_ms_end } = data

  const api_mode = livemode ? 'LIVE' : 'TEST'

  const date_str_begin = new Date(ts_ms_begin).toUTCString()
  const date_str_end = new Date(ts_ms_end).toUTCString()

  // https://html-color.codes/
  // https://css-tricks.com/css-ruleset-terminology/
  const css_rulesets = [
    `code, li, p {
      font-size: 1.2em;
    }`,
    `h3 {
      font-size: 1.4em;
    }`,
    `.entry {
      border: 1px dashed darkgray;
      padding: 2em 1em;
    }`
  ]

  const style = `<style>${css_rulesets.join('')}</style>`
  const head_fragments = [`<meta charset="utf-8">`, style]
  const head = `<head>${head_fragments.join('')}</head>`

  const base_url = livemode
    ? 'https://dashboard.stripe.com/customers/'
    : 'https://dashboard.stripe.com/test/customers/'

  const divs = Object.entries(customers_by_email).map(
    ([email, occurrences]) => {
      const h3 = `<h3>${email} appears ${occurrences.length} times</h3>`

      const list_items = occurrences.map((d) => {
        const details: string[] = []
        if (d.name) {
          details.push(`name: ${d.name}`)
        }

        if (details.length > 0) {
          return `<li><a href="${base_url}${d.id}" target="_blank">${
            d.id
          }</a> (${details.join('; ')})</li>`
        } else {
          return `<li><a href="${base_url}${d.id}" target="_blank">${d.id}</a></li>`
        }
      })

      const ol = `<ol>${list_items.join('')}</ol>`
      return `<div class="entry">${h3}${ol}</div>`
    }
  )

  const h2 = `<h2>Duplicate emails in Stripe ${api_mode} mode</h2>`
  const a_stripe_search_api = `<a href="https://stripe.com/docs/search#query-fields-for-customers" target="_blank">Stripe Search API</a>`
  const p0 = `<p>Customers were searched using the ${a_stripe_search_api}, using this query:</p>`
  const pre = `<pre><code>${query}</code></pre>`
  const p1 = `<p>Time range: from ${date_str_begin} to ${date_str_end}.</p>`
  const p2 = `<p>The query returned a total of ${n_total} customers.</p>`
  const p3 = `<p>${divs.length} emails occurr more than once.</p>`

  const body = `<body>${h2}${p0}${pre}${p1}${p2}${p3}${divs.join('')}</body>`

  const title = `Duplicate emails in Stripe ${api_mode} mode`

  const sentences = [
    `Customers were searched using the Stripe Search API.`,
    `Time range: from ${date_str_begin} to ${date_str_end}.`,
    `The query returned a total of ${n_total} customers.`,
    `${divs.length} emails occurr more than once.`
  ]
  const summary = sentences.join('\n')

  const texts = Object.entries(customers_by_email).map(
    ([email, occurrences]) => {
      const items = occurrences.map((d) => {
        const details: string[] = []
        if (d.name) {
          details.push(`name ${d.name}`)
        }

        if (details.length > 0) {
          return `as ${d.id}, with ${details.join(' and ')}.`
        } else {
          return `as ${d.id}.`
        }
      })

      return `${email} appears ${occurrences.length} times: ${items.join('; ')}`
    }
  )
  const text = [title, summary, texts.join('\n')].join('\n\n')

  return { html: `<html>${head}${body}</html>`, text }
}
