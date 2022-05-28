import type { GoogleSpreadsheet } from 'google-spreadsheet'
import hapi_dev_errors from 'hapi-dev-errors'
import type { ErrorReporting } from '@google-cloud/error-reporting'
import Hapi from '@hapi/hapi'
import Inert from '@hapi/inert'
import Vision from '@hapi/vision'
import HapiSwagger from 'hapi-swagger'
import { alertsPost } from './routes/alerts/post.js'
import { webPageTestPingbackGet } from './routes/webpagetest/get.js'
import { AUTH_STRATEGY } from './routes/webpagetest/utils.js'
import {
  healthcheck,
  TAGS as HEALTHCHECK_TAGS
} from '@jackdbd/hapi-healthcheck-plugin'
import { monitor, TAGS as MONITOR_TAGS } from './monitor-plugin/index.js'
import {
  ip_whitelist,
  TAGS as IP_WHITELIST_TAGS
} from '@jackdbd/hapi-ip-whitelist-plugin'
import {
  netlify_webhooks,
  TAGS as NETLIFY_WEBHOOKS_TAGS
} from './netlify-webhooks-plugin/index.js'
import { subscribe } from './logger.js'

interface Config {
  doc: GoogleSpreadsheet
  environment: string
  error_reporting: ErrorReporting
  netlify_site: { id: string; name: string; url: string }
  port: number | string
  service_name: string
  service_version: string
  telegram_chat_id: string
  telegram_token: string
  webpagetest_tester_ips: string[]
}

export const app = async ({
  doc,
  environment,
  error_reporting,
  netlify_site,
  port,
  service_name,
  service_version,
  telegram_chat_id,
  telegram_token,
  webpagetest_tester_ips
}: Config) => {
  //
  const request_tags = [
    ...HEALTHCHECK_TAGS.request,
    ...IP_WHITELIST_TAGS.request,
    ...MONITOR_TAGS.request,
    ...NETLIFY_WEBHOOKS_TAGS.request
  ]

  const server_tags = [
    ...HEALTHCHECK_TAGS.server,
    ...IP_WHITELIST_TAGS.server,
    ...MONITOR_TAGS.server,
    ...NETLIFY_WEBHOOKS_TAGS.server,
    'lifecycle'
  ]

  const server = Hapi.server({
    // disable Hapi debug console logging, since I don't particulary like it (I
    // prefer writing my own loggers for development/production)
    debug: false,
    port
  })
  subscribe({ request_tags, server, server_tags })

  await server.register(Inert)
  await server.register(Vision)

  await server.register({
    plugin: HapiSwagger,
    options: {
      documentationPath: '/docs',
      info: {
        title: `API Documentation for ${service_name}`,
        version: service_version
      }
    }
  })

  await server.register({
    plugin: hapi_dev_errors,
    options: {
      showErrors: environment !== 'production'
    }
  })

  server.log(['lifecycle'], {
    message: `HTTP server created. Environment: ${environment}`
  })

  // allow 127.0.0.1 in development, so the ngrok public URL can be set as
  // WebPageTest pingback.
  // Reminder: ngrok public URL will be tunneled to 127.0.0.1 with this command:
  // ngrok http 8080
  const ips_allowed_for_webpagetest_pingback =
    environment === 'development'
      ? [...webpagetest_tester_ips, '127.0.0.1']
      : webpagetest_tester_ips

  await server.register({
    plugin: ip_whitelist,
    options: {
      configurations: [
        {
          strategy_name: AUTH_STRATEGY.allow_pingbacks_from_webpagetest_api,
          whitelist: ips_allowed_for_webpagetest_pingback
        }
      ]
    }
  })

  await server.register({
    plugin: healthcheck,
    options: {
      response_message_when_healthy: "Yo! I'm healthy!!!"
    }
  })

  await server.register({ plugin: monitor })

  await server.register({
    plugin: netlify_webhooks,
    options: {
      path: '/netlify',
      site_name: netlify_site.name,
      site_url: netlify_site.url,
      telegram_chat_id,
      telegram_token
    }
  })

  server.route({
    path: '/favicon.ico',
    method: 'GET',
    handler: () => {
      return { message: "don't mind the  favicon" }
    }
  })

  server.route(
    alertsPost({
      service_name,
      service_version,
      telegram_chat_id,
      telegram_token
    })
  )

  server.route(
    webPageTestPingbackGet({
      doc,
      service_name,
      service_version,
      telegram_chat_id,
      telegram_token
    })
  )

  // https://github.com/googleapis/nodejs-error-reporting/blob/e5f725d8e4045af86756c456d3b37ed66d702753/src/interfaces/hapi.ts
  await server.register(error_reporting.hapi)

  return { server }
}
