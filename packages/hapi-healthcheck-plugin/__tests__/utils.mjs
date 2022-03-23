import Hapi from '@hapi/hapi'
import { healthcheck } from '../lib/index.js'

export const MESSAGE_WHEN_HEALTHY = "I'm healthy"
export const MESSAGE_WHEN_UNHEALTHY = "I'm unhealthy"

export const healthyServer = async () => {
  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin: healthcheck,
    options: {
      response_message_when_healthy: MESSAGE_WHEN_HEALTHY
    }
  })

  return server
}

export const unhealthyServer = async () => {
  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin: healthcheck,
    options: {
      isHealthy: async () => false,
      response_message_when_healthy: MESSAGE_WHEN_HEALTHY,
      response_message_when_unhealthy: MESSAGE_WHEN_UNHEALTHY
    }
  })

  return server
}
