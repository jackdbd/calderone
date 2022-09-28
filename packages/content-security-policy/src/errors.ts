import { deprecatedDirectives } from './directives.js'
import type { DeprecatedDirectiveKey } from './directives.js'

/**
 * @public
 */
export interface Config {
  allowDeprecatedDirectives: boolean
  error: any
}

/**
 * @public
 */
export const validationErrorOrWarnings = ({
  allowDeprecatedDirectives,
  error
}: Config) => {
  const detail = error.details[0]
  const warnings: string[] = []

  if (detail.path.length === 2) {
    const directive = detail.path[1] as DeprecatedDirectiveKey

    //   const value = detail.context.value
    const deprecatedDirective = deprecatedDirectives[directive]

    if (deprecatedDirective) {
      const message = [
        `CSP directive ${directive} is deprecated`,
        `Instead, ${deprecatedDirective.whatToDoInstead}`,
        `Learn more: ${deprecatedDirective.hrefs.join(' ')}`
      ].join('. ')

      if (allowDeprecatedDirectives) {
        warnings.push(message)
        return { warnings }
      } else {
        const tip = `Remove the deprecated directives, or set allowDeprecatedDirectives: true if you want to allow them.`
        return {
          error: new Error(`invalid configuration: ${message}. ${tip}`),
          warnings
        }
      }
    } else {
      // This is an error about a CSP directives, but it's not related to a
      // deprecated directive.
      return {
        error: new Error(`invalid configuration: ${error.message}`),
        warnings
      }
    }
  } else {
    // This is an error about something else in the plugin configuration.
    if (detail.context && detail.context.message) {
      return {
        error: new Error(`invalid configuration: ${detail.context.message}`),
        warnings
      }
    } else {
      return {
        error: new Error(`invalid configuration: ${error.message}`),
        warnings
      }
    }
  }
}
