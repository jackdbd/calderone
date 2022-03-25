import type { GoogleSpreadsheet } from 'google-spreadsheet'
import hapi_dev_errors from 'hapi-dev-errors'
import type { ErrorReporting } from '@google-cloud/error-reporting'
import Hapi from '@hapi/hapi'
// import { githubDelete } from './routes/github/delete.js'
import { githubPost } from './routes/github/post.js'
// import { redditDelete } from './routes/reddit/delete.js'
import { redditPost } from './routes/reddit/post.js'
// import { stackOverflowDelete } from './routes/stack-overflow/delete.js'
import { stackOverflowPost } from './routes/stack-overflow/post.js'
// import { twitterDelete } from './routes/twitter/delete.js'
import { twitterPost } from './routes/twitter/post.js'
import {
  healthcheck,
  TAGS as HEALTHCHECK_TAGS
} from '@jackdbd/hapi-healthcheck-plugin'
import { subscribe } from './logger.js'

interface Config {
  doc: GoogleSpreadsheet
  environment: string
  error_reporting: ErrorReporting
  port: number | string
  reddit_oauth_client_id: string
  reddit_oauth_client_secret: string
  reddit_username: string
  reddit_password: string
  twitter_oauth_token: string
}

export const app = async ({
  doc,
  environment,
  error_reporting,
  port,
  reddit_oauth_client_id,
  reddit_oauth_client_secret,
  reddit_password,
  reddit_username,
  twitter_oauth_token
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

  server.route(githubPost({ doc }))

  server.route(
    redditPost({
      doc,
      reddit_oauth_client_id,
      reddit_oauth_client_secret,
      reddit_username,
      reddit_password,
      user_agent: 'wasm-news'
    })
  )

  server.route(stackOverflowPost({ doc }))

  // server.route(githubDelete({ doc }))
  // server.route(redditDelete({ doc }))
  // server.route(stackOverflowDelete({ doc }))
  // server.route(twitterDelete({ doc }))

  server.route(twitterPost({ doc, twitter_oauth_token }))

  // https://github.com/googleapis/nodejs-error-reporting/blob/e5f725d8e4045af86756c456d3b37ed66d702753/src/interfaces/hapi.ts
  await server.register(error_reporting.hapi)

  return { server }
}
