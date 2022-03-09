import Boom from '@hapi/boom'
import type Hapi from '@hapi/hapi'
import { matches } from './predicates.js'
import { SERVER_TAGS, REQUEST_TAGS } from './constants.js'

export interface Options {
  whitelist?: string[]
}

const DEFAULT: Required<Options> = {
  whitelist: ['0.0.0.0', '127.0.0.1']
}

export const SCHEME_NAME = 'ip-whitelist'

/**
 * Authentication scheme to check whether the IP of the incoming HTTP request
 * comes from a whitelisted IP.
 *
 * https://hapi.dev/tutorials/auth/?lang=en_US#schemes
 * https://github.com/hapijs/cookie/blob/master/lib/index.js
 */
export const ipWhitelistScheme = (
  server: Hapi.Server,
  options?: Options
): Hapi.ServerAuthSchemeObject => {
  const whitelist = options?.whitelist || DEFAULT.whitelist

  server.log(SERVER_TAGS, { message: 'whitelist', whitelist })

  return {
    authenticate: async (request, h) => {
      const { remoteAddress } = request.info
      request.log(REQUEST_TAGS, {
        message: `authenticate request coming from IP ${remoteAddress}`
      })

      const whitelisted = whitelist.some((whitelisted_ip) => {
        return matches(whitelisted_ip, remoteAddress)
      })

      request.log(REQUEST_TAGS, {
        message: 'is incoming IP whitelisted?',
        ip: remoteAddress,
        whitelisted
      })

      if (whitelisted) {
        // TODO: not sure if I need to set credentials.scope. Maybe I should set
        // something else? Write an explanation about this.
        return h.authenticated({ credentials: { scope: [remoteAddress] } })
      } else {
        // TODO: maybe add an option to configure this error message
        throw Boom.unauthorized(
          `${remoteAddress} is not allowed to access this route`
        )
      }
    }
  }
}
