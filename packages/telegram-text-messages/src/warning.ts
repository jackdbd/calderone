import { Emoji } from './constants.js'
import { genericText } from './generic-text.js'
import type { Link } from './interfaces.js'

export interface Config {
  app_name: string
  app_version?: string
  links?: Link[]
  warning_message: string
  warning_title: string
}

export const warningText = (config: Config) => {
  const { app_name, app_version, warning_message, warning_title, links } =
    config

  return genericText({
    title: app_name,
    subtitle: app_version,
    description: [
      `<b>${Emoji.Warning} ${warning_title}</b>`,
      `<pre>${warning_message}</pre>`
    ].join('\n'),
    links
  })
}
