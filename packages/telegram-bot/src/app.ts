import hapi_dev_errors from 'hapi-dev-errors'
import type { ErrorReporting } from '@google-cloud/error-reporting'
import Hapi from '@hapi/hapi'
import { homeGet } from './routes/home/get.js'
import { homePost } from './routes/home/post.js'
import {
  healthcheck,
  TAGS as HEALTHCHECK_TAGS
} from '@jackdbd/hapi-healthcheck-plugin'
import { subscribe } from './logger.js'

interface Config {
  environment: string
  error_reporting: ErrorReporting
  port: number | string
  project_id: string
  telegram_token: string
}

export const app = async ({
  environment,
  error_reporting,
  port,
  project_id,
  telegram_token
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
    plugin: healthcheck,
    options: {
      response_message_when_healthy: "Yo! I'm healthy!!!"
    }
  })

  server.route(homeGet())

  server.route(homePost({ project_id, telegram_token }))

  server.route({
    path: '/favicon.ico',
    method: 'GET',
    handler: () => {
      return { message: "don't mind the  favicon" }
    }
  })

  // https://github.com/googleapis/nodejs-error-reporting/blob/e5f725d8e4045af86756c456d3b37ed66d702753/src/interfaces/hapi.ts
  await server.register(error_reporting.hapi)

  return { server }
}
