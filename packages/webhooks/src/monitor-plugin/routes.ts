import { uptime } from 'node:process'
import type Hapi from '@hapi/hapi'
import { REQUEST_TAGS } from './constants.js'

export interface Config {
  path: string
}

export const monitorRoute = ({ path }: Config): Hapi.ServerRoute => {
  return {
    method: 'GET',
    path,
    options: {
      auth: false,
      description: 'server monitor endpoint',
      tags: REQUEST_TAGS
    },
    handler: async (request, _h) => {
      request.log(REQUEST_TAGS, { message: 'got request at monitor endpoint' })

      return {
        date_utc: new Date().toUTCString(),
        uptime_seconds: uptime()
      }
    }
  }
}
