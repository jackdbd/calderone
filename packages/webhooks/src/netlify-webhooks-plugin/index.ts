import type Hapi from '@hapi/hapi'
import { SERVER_TAGS, TAGS as ALL_TAGS } from './constants.js'
import { routeGet, routePost } from './routes.js'

const PLUGIN_NAME = 'netlify-webhooks'
export const TAGS = ALL_TAGS

export interface Options {
  /**
   * Relative path where you want to register the Hapi routes.
   */
  path?: string

  /**
   * Netlify site ID
   * The incoming Netlify webhook event does not include this identifier.
   * You can find the site id of all your Netlify websites with a GET request to
   * https://api.netlify.com/api/v1/sites
   */
  // site_id?: string

  /**
   * Netlify site name
   * The incoming Netlify webhook event does not include this info.
   * You can find it in your Netlify site details.
   * https://app.netlify.com/sites/<SITE_NAME>/settings/general
   */
  site_name?: string

  /**
   * Netlify site URL
   */
  site_url?: string

  telegram_chat_id?: string
  telegram_token?: string
}

// List of all Netlify forms registered for a Netlify website
// https://api.netlify.com/api/v1//sites/<SITE_ID>/forms

const DEFAULT: Required<Options> = {
  path: '/netlify',
  site_name: '',
  site_url: '',
  telegram_chat_id: '',
  telegram_token: ''
}

const register = async (server: Hapi.Server, options?: Options) => {
  const path = options?.path || DEFAULT.path
  const site_name = options?.site_name || DEFAULT.site_name
  const site_url = options?.site_url || DEFAULT.site_url
  const telegram_chat_id = options?.telegram_chat_id || DEFAULT.telegram_chat_id
  const telegram_token = options?.telegram_token || DEFAULT.telegram_token

  // TODO: validate with AJV or Joi instead of doing this
  // validate options [begin]

  if (!site_name || site_name === '') {
    throw new Error(
      `site_name not set. You need to specify a Netlify site NAME when registering the plugin ${PLUGIN_NAME}`
    )
  }

  if (!site_url || site_url === '') {
    throw new Error(
      `site_url not set. You need to specify a Netlify site URL when registering the plugin ${PLUGIN_NAME}`
    )
  }
  // validate options [end]

  server.log(SERVER_TAGS, {
    message: `register route to display info about Netlify webhooks at ${path}`
  })
  server.route(routeGet({ path, site_url }))
  server.log(SERVER_TAGS, {
    message: `route to display info about Netlify webhooks registered at ${path}`
  })

  server.log(SERVER_TAGS, {
    message: `register route to catch Netlify webhooks at ${path}`
  })
  server.route(routePost({ path, site_name, telegram_chat_id, telegram_token }))
  server.log(SERVER_TAGS, {
    message: `route to catch Netlify webhooks registered at ${path}`
  })
}

export const netlify_webhooks = {
  // dependencies,
  multiple: false,
  name: PLUGIN_NAME,
  register,
  requirements: {
    hapi: '>=20.0.0'
    // node: '>=16.0.0'
  },
  version: '0.0.1'
}
