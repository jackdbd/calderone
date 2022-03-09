import type Hapi from '@hapi/hapi'
import { REQUEST_TAGS } from './constants.js'
import { makeHealthCheckHandler } from './handlers.js'

export interface Config {
  isHealthy: () => Promise<boolean>
  path: string
  message_healthy: string
  message_unhealthy: string
}

export const healthcheckRoute = ({
  isHealthy,
  path,
  message_healthy,
  message_unhealthy
}: Config): Hapi.ServerRoute => {
  // TODO: validate config?
  return {
    method: 'GET',
    path,
    options: {
      auth: false,
      description: 'Check whether the server is healthy or not',
      tags: REQUEST_TAGS
    },
    handler: makeHealthCheckHandler({
      isHealthy,
      message_healthy,
      message_unhealthy
    })
  }
}
