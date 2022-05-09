import { MAX_CHARS } from './constants.js'
import type { Link } from './interfaces.js'
import { operationText } from './operation.js'
import type { Config as OperationConfig } from './operation.js'

export interface Config {
  app_name: string
  app_version: string
  description: string
  operations: OperationConfig[]
  links?: Link[]
}

export const operationListText = ({
  app_name,
  app_version,
  description,
  operations,
  links
}: Config) => {
  const s0 = `<b>${app_name}</b>`
  const s1 = `<i>vers. ${app_version}</i>`
  const s2 = `${description}`

  const s3 = operations.map((op) => operationText(op)).join('\n\n')

  let s4 = ''
  if (links) {
    const anchor_tags = links.map(
      (link) => `<a href="${link.href}">${link.text}</a>`
    )
    s4 = anchor_tags.join('\n')
  }

  return `${s0}\n${s1}\n\n${s2}\n\n${s3}\n\n${s4}`.slice(0, MAX_CHARS)
}
