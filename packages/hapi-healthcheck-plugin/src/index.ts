import type Hapi from '@hapi/hapi'
import { healthcheckRoute } from './routes.js'
import { SERVER_TAGS, TAGS as ALL_TAGS } from './constants.js'

export const TAGS = ALL_TAGS

export interface Options {
  isHealthy?: () => Promise<boolean>
  path?: string
  response_message_when_healthy?: string
  response_message_when_unhealthy?: string
}

const DEFAULT: Required<Options> = {
  isHealthy: async () => true,
  path: '/health',
  response_message_when_healthy: 'server is healthy',
  response_message_when_unhealthy: 'server is unhealthy'
}

const register = async (server: Hapi.Server, options?: Options) => {
  const path = options?.path || DEFAULT.path

  server.log(SERVER_TAGS, { message: `register healthcheck route at ${path}` })

  server.route(
    healthcheckRoute({
      isHealthy: options?.isHealthy || DEFAULT.isHealthy,
      path,
      message_healthy:
        options?.response_message_when_healthy ||
        DEFAULT.response_message_when_healthy,
      message_unhealthy:
        options?.response_message_when_unhealthy ||
        DEFAULT.response_message_when_unhealthy
    })
  )

  server.log(SERVER_TAGS, {
    message: `healthcheck route registered at ${path}`
  })
}

export const healthcheck = {
  // dependencies,
  multiple: false,
  name: 'healthcheck',
  register,
  requirements: {
    hapi: '>=20.0.0'
    // node: '>=16.0.0'
  },
  version: '0.0.1'
}
