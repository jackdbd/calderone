import makeDebug from 'debug'
import { stringReplacer } from './utils.js'
import {
  cspSourceValuesStyleAttr,
  cspSourceValuesScriptElem,
  cspSourceValuesScriptAttr,
  cspSourceValuesStyleElem
} from './source-values.js'
import type { Directives } from './directives.js'

const debug = makeDebug('csp/csp-directives')

/**
 * @public
 */
export interface Config {
  directives: Directives
  patterns: string[]
}

/**
 * @public
 */
export const cspDirectives = async ({ directives, patterns }: Config) => {
  const m = { ...directives }

  const [
    script_src,
    script_src_attr,
    script_src_elem,
    style_src,
    style_src_attr,
    style_src_elem
  ] = await Promise.all([
    cspSourceValuesScriptElem({
      directive: 'script-src',
      directives,
      patterns
    }),
    cspSourceValuesScriptAttr({
      directive: 'script-src-attr',
      directives,
      patterns
    }),
    cspSourceValuesScriptElem({
      directive: 'script-src-elem',
      directives,
      patterns
    }),
    cspSourceValuesStyleElem({
      directives,
      directive: 'style-src',
      patterns
    }),
    cspSourceValuesStyleAttr({
      directives,
      directive: 'style-src-attr',
      patterns
    }),
    cspSourceValuesStyleElem({
      directives,
      directive: 'style-src-elem',
      patterns
    })
  ])

  if (script_src) {
    m['script-src'] = script_src
  }

  if (script_src_attr) {
    m['script-src-attr'] = script_src_attr
  }

  if (script_src_elem) {
    m['script-src-elem'] = script_src_elem
  }

  if (style_src) {
    m['style-src'] = style_src
  }

  if (style_src_attr) {
    m['style-src-attr'] = style_src_attr
  }

  if (style_src_elem) {
    m['style-src-elem'] = style_src_elem
  }

  const arr = Object.entries(m).map(([key, value]) => {
    debug(`${key} %o`, value)
    if ((value as any) === true) {
      return key
    }
    const strings = (value as any).map(stringReplacer)
    return `${key} ${strings.join(' ')}`
  })
  debug('CSP directives that represent the policy %O', arr)

  return arr
}

/**
 * @public
 */
export const cspHeader = async ({ directives, patterns }: Config) => {
  const arr = await cspDirectives({
    directives,
    patterns
  })

  return arr.join('; ')
}

/**
 * @public
 */
export const cspJSON = async ({ directives, patterns }: Config) => {
  const arr = await cspDirectives({
    directives,
    patterns
  })

  return arr.reduce((acc, cv) => {
    const [k, ...rest] = cv.split(' ')
    return { ...acc, [k]: rest }
  }, {})
}
