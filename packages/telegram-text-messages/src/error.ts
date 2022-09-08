import { Emoji } from './constants.js'
import { genericText } from './generic-text.js'
import type { Link } from './interfaces.js'

export interface Config {
  app_name: string
  app_version?: string
  error_message: string
  error_title: string
  links?: Link[]
}

export const errorText = (config: Config) => {
  const { app_name, app_version, error_message, error_title, links } = config

  return genericText({
    title: app_name,
    subtitle: app_version,
    description: [
      `<b>${Emoji.Error} ${error_title}</b>`,
      `<pre>${error_message}</pre>`
    ].join('\n'),
    links
  })
}
