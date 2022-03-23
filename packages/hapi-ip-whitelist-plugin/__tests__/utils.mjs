import Hapi from '@hapi/hapi'
import { ip_whitelist } from '../lib/index.js'

const AUTH_STRATEGY_DENY_ALL = 'deny-all-strategy'
const AUTH_STRATEGY_ALLOW_LOCALHOST = 'allow-localhost-strategy'

export const MESSAGE = 'if your read this your IP was whitelisted'

const makeRoute = (strategy_name) => {
  return {
    path: '/',
    method: 'GET',
    options: { auth: strategy_name },
    handler: () => {
      return { message: MESSAGE }
    }
  }
}

export const denyAllServer = async () => {
  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin: ip_whitelist,
    options: {
      configurations: [
        {
          strategy_name: AUTH_STRATEGY_DENY_ALL,
          whitelist: []
        }
      ]
    }
  })

  server.route(makeRoute(AUTH_STRATEGY_DENY_ALL))

  return server
}

export const allowLocalhostServer = async () => {
  const server = Hapi.server({ port: 8080 })

  await server.register({
    plugin: ip_whitelist,
    options: {
      configurations: [
        {
          strategy_name: AUTH_STRATEGY_ALLOW_LOCALHOST,
          whitelist: ['127.0.0.1']
        }
      ]
    }
  })

  server.route(makeRoute(AUTH_STRATEGY_ALLOW_LOCALHOST))

  return server
}
