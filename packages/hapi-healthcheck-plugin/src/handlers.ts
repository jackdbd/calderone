import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { REQUEST_TAGS } from './constants.js'

interface Config {
  isHealthy: () => Promise<boolean>
  message_healthy: string
  message_unhealthy: string
}

// extract the handler, so it's easier to test I guess...
export const makeHealthCheckHandler = ({
  isHealthy,
  message_healthy,
  message_unhealthy
}: Config) => {
  // TODO: validate config?
  return async function healthcheckHandler(
    request: Hapi.Request,
    _h: Hapi.ResponseToolkit
  ) {
    request.log(REQUEST_TAGS, {
      message: 'got request at healthcheck endpoint'
    })

    let healthy = false
    try {
      healthy = await isHealthy()
    } catch (err: any) {
      throw Boom.internal(`healthcheck errored: ${err.message}`)
    }

    if (healthy) {
      return { healthy, message: message_healthy }
    } else {
      // TODO: function to notify that the server was not healthy
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/503
      throw Boom.serverUnavailable(message_unhealthy)
    }
  }
}
