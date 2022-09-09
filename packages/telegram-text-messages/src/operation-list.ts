import { Emoji } from './constants.js'
import { genericText } from './generic-text.js'
import type { Link, Section } from './interfaces.js'
import type { Config as OperationConfig } from './operation.js'

export interface Config {
  app_name: string
  app_version: string
  description: string
  operations: OperationConfig[]
  links?: Link[]
}

export const operationListText = (config: Config) => {
  const { app_name, app_version, description, operations, links } = config

  const sections = operations.map((op) => {
    const subsections = [] as Section[]

    if (op.successes.length > 0) {
      subsections.push({
        title: `${op.successes.length} Successes`,
        body: op.successes.map((s) => `${Emoji.Success} ${s}`).join('\n')
      })
    }

    if (op.failures.length > 0) {
      subsections.push({
        title: `${op.failures.length} Failures`,
        body: op.failures.map((s) => `${Emoji.Failure} ${s}`).join('\n')
      })
    }

    if (op.warnings.length > 0) {
      subsections.push({
        title: `${op.warnings.length} Warnings`,
        body: op.warnings.map((s) => `${Emoji.Warning} ${s}`).join('\n')
      })
    }

    return {
      title: op.title,
      body: subsections.map((sub) => `${sub.title}\n${sub.body}`).join('\n\n')
    }
  })

  return genericText({
    title: app_name,
    subtitle: app_version,
    description,
    sections,
    links
  })
}
