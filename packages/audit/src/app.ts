import type { GoogleSpreadsheet } from 'google-spreadsheet'
import hapi_dev_errors from 'hapi-dev-errors'
import type { ErrorReporting } from '@google-cloud/error-reporting'
import type { ExecutionsClient } from '@google-cloud/workflows'
import Hapi from '@hapi/hapi'
import { auditPost } from './routes/audit/post.js'
import {
  healthcheck,
  TAGS as HEALTHCHECK_TAGS
} from '@jackdbd/hapi-healthcheck-plugin'
import { subscribe } from './logger.js'

interface Config {
  cloud_run_logs_href: string
  doc: GoogleSpreadsheet
  environment: string
  error_reporting: ErrorReporting
  port: number | string
  service_name: string
  service_version: string
  telegram_chat_id: string
  telegram_token: string
  workflow_executions: ExecutionsClient
  workflow_path: string
}

export const app = async ({
  cloud_run_logs_href,
  doc,
  environment,
  error_reporting,
  port,
  service_name,
  service_version,
  telegram_chat_id,
  telegram_token,
  workflow_executions,
  workflow_path
}: Config) => {
  const request_tags = [...HEALTHCHECK_TAGS.request]

  const server_tags = [...HEALTHCHECK_TAGS.server, 'lifecycle']

  const server = Hapi.server({
    // disable Hapi debug console logging, since I don't particulary like it (I
    // prefer writing my own loggers for development/production)
    debug: false,
    port
  })
  subscribe({ request_tags, server, server_tags })

  await server.register({
    plugin: hapi_dev_errors,
    options: {
      showErrors: environment !== 'production'
    }
  })

  server.log(['lifecycle'], {
    message: `HTTP server created. Environment: ${environment}`
  })

  await server.register({
    plugin: healthcheck
  })

  server.route({
    path: '/favicon.ico',
    method: 'GET',
    handler: () => {
      return { message: "don't mind the  favicon" }
    }
  })

  server.route(
    auditPost({
      cloud_run_logs_href,
      doc,
      service_name,
      service_version,
      telegram_chat_id,
      telegram_token,
      workflow_executions,
      workflow_path
    })
  )

  // https://github.com/googleapis/nodejs-error-reporting/blob/e5f725d8e4045af86756c456d3b37ed66d702753/src/interfaces/hapi.ts
  await server.register(error_reporting.hapi)

  return { server }
}
