import type Hapi from '@hapi/hapi'
import { SERVER_TAGS, TAGS as ALL_TAGS } from './constants.js'
import { ipWhitelistScheme, SCHEME_NAME } from './schemes.js'

export const TAGS = ALL_TAGS

export interface Options {
  configurations: { strategy_name: string; whitelist: string[] }[]
}

const DEFAULT: Required<Options> = {
  configurations: []
}

const register = async (server: Hapi.Server, options?: Options) => {
  const configurations = options?.configurations || DEFAULT.configurations

  server.auth.scheme(SCHEME_NAME, ipWhitelistScheme)
  server.log(SERVER_TAGS, {
    message: `auth scheme "${SCHEME_NAME}" registered`
  })

  configurations.forEach(({ strategy_name, whitelist }) => {
    server.log(SERVER_TAGS, {
      message: `whitelist for strategy "${strategy_name}"`,
      whitelist
    })
    server.auth.strategy(strategy_name, SCHEME_NAME, { whitelist })
    server.log(SERVER_TAGS, {
      message: `auth strategy "${strategy_name}" registered`
    })
  })
}

export const ip_whitelist: Hapi.Plugin<Options> = {
  // dependencies,
  multiple: false,
  name: 'ip-whitelist',
  register,
  requirements: {
    hapi: '>=20.0.0'
    // node: '>=16.0.0'
  },
  version: '0.0.1'
}
