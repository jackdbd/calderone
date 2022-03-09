import type Hapi from '@hapi/hapi'
import { SERVER_TAGS, TAGS as ALL_TAGS } from './constants.js'
import { monitorRoute } from './routes.js'

export const TAGS = ALL_TAGS

export interface Options {
  path?: string
}

const DEFAULT: Required<Options> = {
  path: '/monitor'
}

const register = async (server: Hapi.Server, options?: Options) => {
  const path = options?.path || DEFAULT.path

  server.log(SERVER_TAGS, { message: `register monitor route at ${path}` })

  server.route(monitorRoute({ path }))

  server.log(SERVER_TAGS, { message: `monitor route registered at ${path}` })
}

export const monitor = {
  // dependencies,
  multiple: false,
  name: 'monitor',
  register,
  requirements: {
    hapi: '>=20.0.0'
    // node: '>=16.0.0'
  },
  version: '0.0.1'
}
