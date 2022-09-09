import { Emoji } from './constants.js'
import { genericText } from './generic-text.js'
import type { Section } from './interfaces.js'

export interface Config {
  title: string
  successes: string[]
  failures: string[]
  warnings: string[]
}

export const operationText = ({
  title,
  successes,
  failures,
  warnings
}: Config) => {
  const sections = [] as Section[]

  if (successes.length > 0) {
    sections.push({
      title: `${successes.length} Successes`,
      body: successes.map((s) => `${Emoji.Success} ${s}`).join('\n')
    })
  }

  if (failures.length > 0) {
    sections.push({
      title: `${failures.length} Failures`,
      body: failures.map((s) => `${Emoji.Failure} ${s}`).join('\n')
    })
  }

  if (warnings.length > 0) {
    sections.push({
      title: `${warnings.length} Warnings`,
      body: warnings.map((s) => `${Emoji.Warning} ${s}`).join('\n')
    })
  }

  return genericText({
    title,
    description: '',
    sections
  })
}
