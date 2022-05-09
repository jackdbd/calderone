import { env } from 'node:process'
import makeDebug from 'debug'
import type Hapi from '@hapi/hapi'
import { logDebug } from '@jackdbd/utils/logger'

const debug = makeDebug('webhooks/logger')

export interface Config {
  tags: string[]
}

export const makeLogServerEvent = ({ tags }: Config): Hapi.LogEventHandler => {
  if (env.NODE_ENV === 'development') {
    debug(`logging these tags for server.log(): %o`, tags)
    return function logServerEvent(event) {
      const { data } = event
      const message: string =
        (data as any).message || 'Hapi server.log event with no message'
      debug(`${message}, %o`, { tags: event.tags })
    }
  } else if (env.NODE_ENV === 'production') {
    logDebug({ message: `logging these tags for server.log()`, tags })
    return function logServerEvent(event) {
      const { channel, data, timestamp } = event
      const message: string =
        (data as any).message || 'Hapi server.log event with no message'
      logDebug({ channel, message, tags: event.tags, timestamp })
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return function logServerEvent(_event) {}
  }
}

export const makeLogRequest = ({ tags }: Config): Hapi.RequestEventHandler => {
  if (env.NODE_ENV === 'development') {
    debug(`logging these tags for request.log(): %o`, tags)
    return function logRequest(_request, event, _tags) {
      const { data, error } = event
      if (error && (error as any).output.payload.message) {
        // console.error((error as any).output.payload)
        debug(`${(error as any).output.payload.message}, %o`, {
          tags: event.tags
        })
      } else {
        const message: string =
          (data as any).message || 'Hapi request.log event with no message'
        debug(`${message}, %o`, { tags: event.tags })
      }
    }
  } else if (env.NODE_ENV === 'production') {
    logDebug({ message: `logging these tags for request.log()`, tags })
    return function logRequest(_request, event, _tags) {
      const { channel, data, timestamp } = event
      const message: string =
        (data as any).message || 'Hapi request.log event with no message'
      logDebug({ channel, message, tags: event.tags, timestamp })
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return function logRequest(_request, _event, _tags) {}
  }
}

interface LoggerConfig {
  request_tags: string[]
  server: Hapi.Server
  server_tags: string[]
}

// TODO: make this module a standalone Hapi plugin

/**
 * Subscribe to server/request logging events.
 *
 * https://hapi.dev/api/?v=20.2.1#-servereventsoncriteria-listener
 */
export const subscribe = ({
  request_tags,
  server,
  server_tags
}: LoggerConfig) => {
  server.events.on('log', makeLogServerEvent({ tags: server_tags }))
  server.log(['lifecycle'], {
    message: 'server subscribed to server.log() event handler'
  })
  server.events.on('request', makeLogRequest({ tags: request_tags }))
  server.log(['lifecycle'], {
    message: 'server subscribed to request.log() event handler'
  })
}
